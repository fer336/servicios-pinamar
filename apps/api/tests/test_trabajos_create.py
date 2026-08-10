from __future__ import annotations

import asyncio
import io
import uuid
from collections.abc import AsyncGenerator, Callable, Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import event, func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.db import get_db
from app.main import app
from app.models import Base, Trabajo, TrabajoImagen
from app.routers.trabajos import require_admin
from app.storage import StorageError


def make_jpeg(width: int = 640, height: int = 480, color: tuple[int, int, int] = (30, 60, 120)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (width, height), color).save(buf, format="JPEG", quality=85)
    return buf.getvalue()


@pytest.fixture
def api_client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Generator[tuple[TestClient, dict], None, None]:
    db_path = tmp_path / "test.db"
    engine = create_async_engine(f"sqlite+aiosqlite:///{db_path}", poolclass=NullPool)

    @event.listens_for(engine.sync_engine, "connect")
    def _enable_fk(dbapi_connection, _connection_record) -> None:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    async def setup() -> None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(setup())
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)

    async def override_db() -> AsyncGenerator[AsyncSession, None]:
        async with sessionmaker() as session:
            yield session

    storage: dict = {"put": [], "delete": [], "fail_after_puts": None}

    def fake_put(key: str, data: bytes) -> None:
        fail_after = storage["fail_after_puts"]
        if fail_after is not None and len(storage["put"]) >= fail_after:
            raise StorageError("boom")
        storage["put"].append((key, data))

    def fake_delete(keys: list[str]) -> None:
        storage["delete"].extend(keys)

    monkeypatch.setattr("app.routers.trabajos.put_object", fake_put)
    monkeypatch.setattr("app.routers.trabajos.delete_objects", fake_delete)
    monkeypatch.setattr("app.routers.trabajos.public_url", lambda key: f"https://cdn.example/{key}")
    app.dependency_overrides[get_db] = override_db
    app.dependency_overrides[require_admin] = lambda: None

    def run_db(fn: Callable[[AsyncSession], object]) -> object:
        async def wrapped() -> object:
            async with sessionmaker() as session:
                result = fn(session)
                if hasattr(result, "__await__"):
                    return await result
                return result

        return asyncio.run(wrapped())

    storage["run_db"] = run_db

    with TestClient(app) as client:
        yield client, storage

    app.dependency_overrides.clear()
    asyncio.run(engine.dispose())


def image_files(count: int) -> list[tuple[str, tuple[str, io.BytesIO, str]]]:
    return [
        ("files", (f"image-{index}.jpg", io.BytesIO(make_jpeg(color=(30 + index, 60, 120))), "image/jpeg"))
        for index in range(count)
    ]


def create_work(client: TestClient, count: int = 2, service: str = "gas") -> dict:
    res = client.post(
        "/api/trabajos",
        data={"title": "Trabajo de prueba", "service": service, "alt": "foto", "aspect_ratio": "4 / 3"},
        files=image_files(count),
    )
    assert res.status_code == 201, res.text
    return res.json()


def test_create_trabajo_accepts_1_to_12_images_and_first_is_cover(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    body = create_work(client, count=12)

    assert body["imageUrl"] == body["images"][0]["imageUrl"]
    assert body["thumbnailUrl"] == body["images"][0]["thumbnailUrl"]
    assert [image["sortOrder"] for image in body["images"]] == list(range(12))
    assert [image["isCover"] for image in body["images"]].count(True) == 1
    assert body["images"][0]["isCover"] is True
    assert len(storage["put"]) == 24
    assert all(f"trabajos/{body['id']}/" in key for key, _ in storage["put"])


def test_create_rejects_invalid_mime_payload_with_415(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    res = client.post(
        "/api/trabajos",
        data={"title": "Trabajo", "service": "gas"},
        files=[("files", ("bad.txt", io.BytesIO(b"not an image"), "text/plain"))],
    )

    assert res.status_code == 415
    assert storage["put"] == []


def test_create_rolls_back_and_cleans_uploaded_objects_on_s3_failure(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    storage["fail_after_puts"] = 1

    res = client.post(
        "/api/trabajos",
        data={"title": "Trabajo", "service": "gas"},
        files=image_files(2),
    )

    assert res.status_code == 502
    assert len(storage["put"]) == 1
    assert storage["delete"] == [storage["put"][0][0]]

    async def count_rows(session: AsyncSession) -> int:
        return (await session.execute(select(func.count(Trabajo.id)))).scalar_one()

    assert storage["run_db"](count_rows) == 0


def test_service_filter_pagination_returns_images_without_n_plus_one(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    create_work(client, count=2, service="gas")
    create_work(client, count=2, service="pintura")
    create_work(client, count=2, service="pintura")

    statement_count = 0

    def before_cursor_execute(*_args) -> None:
        nonlocal statement_count
        statement_count += 1

    async def run_list(session: AsyncSession):
        event.listen(session.bind.sync_engine, "before_cursor_execute", before_cursor_execute)
        try:
            res = client.get("/api/trabajos?service=pintura&page=1&limit=2")
            assert res.status_code == 200
            return res.json()
        finally:
            event.remove(session.bind.sync_engine, "before_cursor_execute", before_cursor_execute)

    body = storage["run_db"](run_list)
    assert body["total"] == 2
    assert all(item["service"] == "pintura" for item in body["items"])
    assert all(len(item["images"]) == 2 for item in body["items"])
    assert statement_count <= 3


def test_delete_trabajo_cascades_images_and_cleans_all_objects(api_client: tuple[TestClient, dict]) -> None:
    client, storage = api_client
    body = create_work(client, count=3)
    old_keys = [key for image in body["images"] for key in (f"trabajos/{body['id']}/{image['id']}/image.webp", f"trabajos/{body['id']}/{image['id']}/thumbnail.webp")]

    res = client.delete(f"/api/trabajos/{body['id']}")
    assert res.status_code == 204
    assert storage["delete"] == old_keys

    async def count_images(session: AsyncSession) -> int:
        return (await session.execute(select(func.count(TrabajoImagen.id)))).scalar_one()

    assert storage["run_db"](count_images) == 0


def test_backfilled_existing_work_has_one_cover_image_row(api_client: tuple[TestClient, dict]) -> None:
    _client, storage = api_client
    trabajo_id = uuid.uuid4()

    async def insert_existing_work(session: AsyncSession) -> None:
        trabajo = Trabajo(
            id=trabajo_id,
            service="gas",
            title="Existente",
            description="",
            alt="alt existente",
            image_key="trabajos/old/image.webp",
            thumbnail_key="trabajos/old/thumbnail.webp",
            image_url="https://cdn.example/trabajos/old/image.webp",
            thumbnail_url="https://cdn.example/trabajos/old/thumbnail.webp",
            aspect_ratio="4 / 3",
        )
        session.add(trabajo)
        await session.flush()
        session.add(
            TrabajoImagen(
                trabajo_id=trabajo.id,
                image_key=trabajo.image_key,
                thumbnail_key=trabajo.thumbnail_key,
                image_url=trabajo.image_url,
                thumbnail_url=trabajo.thumbnail_url,
                alt=trabajo.alt,
                aspect_ratio=trabajo.aspect_ratio,
                sort_order=0,
                is_cover=True,
            )
        )
        await session.commit()

    storage["run_db"](insert_existing_work)

    async def fetch_images(session: AsyncSession):
        return (
            await session.execute(select(TrabajoImagen).where(TrabajoImagen.trabajo_id == trabajo_id))
        ).scalars().all()

    images = storage["run_db"](fetch_images)
    assert len(images) == 1
    assert images[0].is_cover is True
    assert images[0].sort_order == 0
