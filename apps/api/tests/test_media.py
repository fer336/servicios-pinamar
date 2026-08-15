from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.storage import StorageNotFound


def test_media_proxy_returns_object_bytes_with_image_headers(monkeypatch) -> None:
    def fake_get_object(object_key: str) -> tuple[bytes, str]:
        assert object_key == "trabajos/demo/thumbnail.webp"
        return b"webp-bytes", "image/webp"

    monkeypatch.setattr("app.routers.media.get_object", fake_get_object)

    with TestClient(app) as client:
        res = client.get("/api/media/trabajos/demo/thumbnail.webp")

    assert res.status_code == 200
    assert res.content == b"webp-bytes"
    assert res.headers["content-type"] == "image/webp"
    assert res.headers["cache-control"] == "public, max-age=31536000, immutable"
    assert res.headers["x-content-type-options"] == "nosniff"


def test_media_proxy_hides_missing_objects(monkeypatch) -> None:
    def fake_get_object(_object_key: str) -> tuple[bytes, str]:
        raise StorageNotFound("missing")

    monkeypatch.setattr("app.routers.media.get_object", fake_get_object)

    with TestClient(app) as client:
        res = client.get("/api/media/trabajos/missing/thumbnail.webp")

    assert res.status_code == 404
