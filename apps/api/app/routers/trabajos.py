from __future__ import annotations

import logging
import uuid
from collections.abc import Sequence

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select, update
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.imaging import InvalidImageError, optimize_image, optimize_thumbnail
from app.models import Trabajo, TrabajoImagen
from app.schemas import TrabajoImageReorder, TrabajoListResponse, TrabajoOut, TrabajoUpdate
from app.security import require_admin
from app.storage import StorageError, delete_objects, public_url, put_object

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/trabajos", tags=["trabajos"])

MAX_LIMIT = 100
DEFAULT_LIMIT = 12
SERVICE_MAX_LENGTH = 50
MAX_IMAGES_PER_TRABAJO = 12


def _to_out(trabajo: Trabajo, *, include_images: bool = True) -> TrabajoOut:
    images = []
    if include_images:
        images = [
            {
                "id": image.id,
                "image_url": public_url(image.image_key),
                "thumbnail_url": public_url(image.thumbnail_key),
                "alt": image.alt,
                "aspect_ratio": image.aspect_ratio,
                "sort_order": image.sort_order,
                "is_cover": image.is_cover,
                "created_at": image.created_at,
            }
            for image in trabajo.images
        ]
    return TrabajoOut.model_validate(
        {
            "id": trabajo.id,
            "title": trabajo.title,
            "description": trabajo.description,
            "thumbnail_url": public_url(trabajo.thumbnail_key),
            "image_url": public_url(trabajo.image_key),
            "alt": trabajo.alt,
            "aspect_ratio": trabajo.aspect_ratio,
            "service": trabajo.service,
            "sort_order": trabajo.sort_order,
            "created_at": trabajo.created_at,
            "images": images,
        }
    )


def _is_missing_gallery_table(exc: DBAPIError) -> bool:
    orig = exc.orig
    pg_code = getattr(orig, "pgcode", None) or getattr(orig, "sqlstate", None)
    if pg_code == "42P01":
        return True
    return "trabajo_imagenes" in str(orig) and "no such table" in str(orig).lower()


async def _get_public_trabajo(db: AsyncSession, trabajo_id: uuid.UUID) -> tuple[Trabajo | None, bool]:
    try:
        trabajo = await _get_trabajo_with_images(db, trabajo_id)
        return trabajo, True
    except DBAPIError as exc:
        if not _is_missing_gallery_table(exc):
            raise
        await db.rollback()
        trabajo = (
            await db.execute(select(Trabajo).where(Trabajo.id == trabajo_id))
        ).scalar_one_or_none()
        return trabajo, False


async def _get_trabajo_with_images(db: AsyncSession, trabajo_id: uuid.UUID) -> Trabajo | None:
    return (
        await db.execute(
            select(Trabajo)
            .options(selectinload(Trabajo.images))
            .where(Trabajo.id == trabajo_id)
            .execution_options(populate_existing=True)
        )
    ).scalar_one_or_none()


def _image_keys(trabajo_id: uuid.UUID, image_id: uuid.UUID) -> tuple[str, str]:
    prefix = f"trabajos/{trabajo_id}/{image_id}"
    return f"{prefix}/image.webp", f"{prefix}/thumbnail.webp"


async def _process_upload(file: UploadFile) -> tuple[bytes, bytes]:
    try:
        full = optimize_image(await file.read())
        thumb = optimize_thumbnail(full)
    except InvalidImageError as exc:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=str(exc)) from exc
    return full.data, thumb.data


def _ensure_image_count(count: int) -> None:
    if count < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="at least one image file is required",
        )
    if count > MAX_IMAGES_PER_TRABAJO:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"a trabajo can have at most {MAX_IMAGES_PER_TRABAJO} images",
        )


def _best_effort_delete(keys: Sequence[str], context: str) -> None:
    try:
        delete_objects(list(keys))
    except StorageError as exc:
        logger.warning("%s object cleanup failed: %s", context, exc)


async def _refresh_with_images(db: AsyncSession, trabajo_id: uuid.UUID) -> Trabajo:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    return trabajo


def _sync_cover_fields(trabajo: Trabajo, image: TrabajoImagen) -> None:
    trabajo.image_key = image.image_key
    trabajo.thumbnail_key = image.thumbnail_key
    trabajo.image_url = image.image_url
    trabajo.thumbnail_url = image.thumbnail_url
    trabajo.alt = image.alt
    trabajo.aspect_ratio = image.aspect_ratio


@router.get("", response_model=TrabajoListResponse, status_code=status.HTTP_200_OK)
async def list_trabajos(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=DEFAULT_LIMIT),
    service: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> TrabajoListResponse:
    limit = max(1, min(limit, MAX_LIMIT))
    base = select(Trabajo).options(selectinload(Trabajo.images))
    count = select(func.count(Trabajo.id))
    if service:
        service = service.strip()
        base = base.where(Trabajo.service == service)
        count = count.where(Trabajo.service == service)

    total = (await db.execute(count)).scalar_one()
    include_images = True
    try:
        rows = (
            await db.execute(
                base.order_by(Trabajo.created_at.desc(), Trabajo.sort_order.asc())
                .offset((page - 1) * limit)
                .limit(limit)
            )
        ).scalars().all()
    except DBAPIError as exc:
        if not _is_missing_gallery_table(exc):
            raise
        await db.rollback()
        include_images = False
        fallback_base = select(Trabajo)
        if service:
            fallback_base = fallback_base.where(Trabajo.service == service)
        rows = (
            await db.execute(
                fallback_base.order_by(Trabajo.created_at.desc(), Trabajo.sort_order.asc())
                .offset((page - 1) * limit)
                .limit(limit)
            )
        ).scalars().all()

    items = [_to_out(t, include_images=include_images) for t in rows]
    return TrabajoListResponse(
        items=items,
        page=page,
        limit=limit,
        total=total,
        has_more=page * limit < total,
    )


@router.get("/{trabajo_id}", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def get_trabajo(trabajo_id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> TrabajoOut:
    trabajo, include_images = await _get_public_trabajo(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    return _to_out(trabajo, include_images=include_images)


def _parse_service(service: str) -> str:
    service = (service or "").strip()
    if not service:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="service is required")
    if len(service) > SERVICE_MAX_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"service must be at most {SERVICE_MAX_LENGTH} characters",
        )
    return service


def _parse_orden(value: str | None) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="orden must be an integer")


@router.post("", response_model=TrabajoOut, status_code=status.HTTP_201_CREATED)
async def create_trabajo(
    title: str = Form(...),
    description: str = Form(default=""),
    alt: str = Form(default=""),
    service: str = Form(...),
    aspect_ratio: str = Form(default="4 / 3"),
    orden: str | None = Form(default=None),
    files: list[UploadFile] = File(default=[]),
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    service_slug = _parse_service(service)
    title = title.strip()
    if not title:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="title is required")
    sort_order = _parse_orden(orden) or 0

    _ensure_image_count(len(files))

    trabajo_id = uuid.uuid4()
    uploaded_keys: list[str] = []
    images: list[TrabajoImagen] = []
    image_alt = alt.strip()
    image_aspect_ratio = aspect_ratio.strip() or "4 / 3"

    try:
        for index, file in enumerate(files):
            image_id = uuid.uuid4()
            image_key, thumbnail_key = _image_keys(trabajo_id, image_id)
            full_data, thumb_data = await _process_upload(file)
            put_object(image_key, full_data)
            uploaded_keys.append(image_key)
            put_object(thumbnail_key, thumb_data)
            uploaded_keys.append(thumbnail_key)
            images.append(
                TrabajoImagen(
                    id=image_id,
                    trabajo_id=trabajo_id,
                    image_key=image_key,
                    thumbnail_key=thumbnail_key,
                    image_url=public_url(image_key),
                    thumbnail_url=public_url(thumbnail_key),
                    alt=image_alt,
                    aspect_ratio=image_aspect_ratio,
                    sort_order=index,
                    is_cover=index == 0,
                )
            )
    except StorageError as exc:
        _best_effort_delete(uploaded_keys, f"create trabajo {trabajo_id} rollback")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="failed to store images",
        ) from exc

    cover = images[0]
    trabajo = Trabajo(
        id=trabajo_id,
        service=service_slug,
        title=title,
        description=description.strip(),
        alt=cover.alt,
        image_key=cover.image_key,
        thumbnail_key=cover.thumbnail_key,
        image_url=cover.image_url,
        thumbnail_url=cover.thumbnail_url,
        aspect_ratio=cover.aspect_ratio,
        sort_order=sort_order,
        images=images,
    )
    try:
        db.add(trabajo)
        await db.commit()
        trabajo = await _refresh_with_images(db, trabajo_id)
    except Exception as exc:
        logger.error("failed to insert trabajo %s: %s", trabajo_id, exc)
        await db.rollback()
        _best_effort_delete(uploaded_keys, f"create trabajo {trabajo_id} rollback")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to save trabajo") from exc

    logger.info("created trabajo %s (service=%s, images=%d)", trabajo_id, service_slug, len(images))
    return _to_out(trabajo)


@router.put("/{trabajo_id}", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def update_trabajo(
    trabajo_id: uuid.UUID,
    payload: TrabajoUpdate,
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")

    changes = payload.model_dump(exclude_unset=True)
    if "orden" in changes:
        changes["sort_order"] = changes.pop("orden")
    if changes.get("service") is not None:
        changes["service"] = _parse_service(changes["service"])

    for field, value in changes.items():
        if value is not None:
            setattr(trabajo, field, value)
    cover = next((image for image in trabajo.images if image.is_cover), None)
    if cover is not None:
        if payload.alt is not None:
            cover.alt = payload.alt.strip()
        if payload.aspect_ratio is not None:
            cover.aspect_ratio = payload.aspect_ratio.strip() or "4 / 3"
        _sync_cover_fields(trabajo, cover)

    await db.commit()
    trabajo = await _refresh_with_images(db, trabajo_id)
    logger.info("updated trabajo %s", trabajo_id)
    return _to_out(trabajo)


@router.post("/{trabajo_id}/imagenes", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def add_trabajo_imagenes(
    trabajo_id: uuid.UUID,
    alt: str | None = Form(default=None),
    aspect_ratio: str | None = Form(default=None),
    files: list[UploadFile] = File(default=[]),
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    _ensure_image_count(len(files))

    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    _ensure_image_count(len(trabajo.images) + len(files))

    uploaded_keys: list[str] = []
    new_images: list[TrabajoImagen] = []
    start = len(trabajo.images)
    try:
        for offset, file in enumerate(files):
            image_id = uuid.uuid4()
            image_key, thumbnail_key = _image_keys(trabajo_id, image_id)
            full_data, thumb_data = await _process_upload(file)
            put_object(image_key, full_data)
            uploaded_keys.append(image_key)
            put_object(thumbnail_key, thumb_data)
            uploaded_keys.append(thumbnail_key)
            new_images.append(
                TrabajoImagen(
                    id=image_id,
                    trabajo_id=trabajo_id,
                    image_key=image_key,
                    thumbnail_key=thumbnail_key,
                    image_url=public_url(image_key),
                    thumbnail_url=public_url(thumbnail_key),
                    alt=(alt.strip() if alt is not None else trabajo.alt),
                    aspect_ratio=(aspect_ratio.strip() if aspect_ratio else trabajo.aspect_ratio),
                    sort_order=start + offset,
                    is_cover=False,
                )
            )
    except StorageError as exc:
        _best_effort_delete(uploaded_keys, f"add images trabajo {trabajo_id} rollback")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="failed to store images") from exc

    try:
        trabajo.images.extend(new_images)
        await db.commit()
        trabajo = await _refresh_with_images(db, trabajo_id)
    except Exception as exc:
        await db.rollback()
        _best_effort_delete(uploaded_keys, f"add images trabajo {trabajo_id} rollback")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to save images") from exc
    return _to_out(trabajo)


@router.delete("/{trabajo_id}/imagenes/{imagen_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_trabajo_imagen(
    trabajo_id: uuid.UUID,
    imagen_id: uuid.UUID,
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> None:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    if len(trabajo.images) <= 1:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="a trabajo must keep at least one image")
    image = next((item for item in trabajo.images if item.id == imagen_id), None)
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    old_keys = [image.image_key, image.thumbnail_key]
    was_cover = image.is_cover
    trabajo.images.remove(image)
    for index, item in enumerate(trabajo.images):
        item.sort_order = index
    if was_cover:
        trabajo.images[0].is_cover = True
        _sync_cover_fields(trabajo, trabajo.images[0])
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete image") from exc
    _best_effort_delete(old_keys, f"remove image {imagen_id}")


@router.put("/{trabajo_id}/imagenes/reorder", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def reorder_trabajo_imagenes(
    trabajo_id: uuid.UUID,
    payload: TrabajoImageReorder,
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    current = {image.id: image for image in trabajo.images}
    if len(payload.image_ids) != len(current) or set(payload.image_ids) != set(current):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="imageIds must include each existing image exactly once")
    for index, image_id in enumerate(payload.image_ids):
        current[image_id].sort_order = index
    await db.commit()
    trabajo = await _refresh_with_images(db, trabajo_id)
    return _to_out(trabajo)


@router.put("/{trabajo_id}/imagenes/{imagen_id}/cover", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def set_trabajo_cover(
    trabajo_id: uuid.UUID,
    imagen_id: uuid.UUID,
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    target = next((image for image in trabajo.images if image.id == imagen_id), None)
    if target is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    await db.execute(
        update(TrabajoImagen)
        .where(TrabajoImagen.trabajo_id == trabajo_id)
        .values(is_cover=False)
    )
    await db.flush()
    target.is_cover = True
    _sync_cover_fields(trabajo, target)
    await db.commit()
    trabajo = await _refresh_with_images(db, trabajo_id)
    return _to_out(trabajo)


@router.put("/{trabajo_id}/imagenes/{imagen_id}/imagen", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def replace_trabajo_imagen(
    trabajo_id: uuid.UUID,
    imagen_id: uuid.UUID,
    alt: str | None = Form(default=None),
    aspect_ratio: str | None = Form(default=None),
    files: list[UploadFile] = File(default=[]),
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    if not files:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="at least one image file is required")

    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    image = next((item for item in trabajo.images if item.id == imagen_id), None)
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    full_data, thumb_data = await _process_upload(files[0])
    uploaded_keys: list[str] = []
    try:
        put_object(image.image_key, full_data)
        uploaded_keys.append(image.image_key)
        put_object(image.thumbnail_key, thumb_data)
        uploaded_keys.append(image.thumbnail_key)
    except StorageError as exc:
        _best_effort_delete(uploaded_keys, f"replace image {imagen_id} rollback")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="failed to store images") from exc

    if alt is not None:
        image.alt = alt.strip()
    if aspect_ratio is not None:
        image.aspect_ratio = aspect_ratio.strip() or "4 / 3"
    image.image_url = public_url(image.image_key)
    image.thumbnail_url = public_url(image.thumbnail_key)
    if image.is_cover:
        _sync_cover_fields(trabajo, image)

    try:
        await db.commit()
        trabajo = await _refresh_with_images(db, trabajo_id)
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to replace image") from exc
    return _to_out(trabajo)


@router.put("/{trabajo_id}/imagen", response_model=TrabajoOut, status_code=status.HTTP_200_OK)
async def replace_trabajo_cover_image_compat(
    trabajo_id: uuid.UUID,
    alt: str | None = Form(default=None),
    files: list[UploadFile] = File(default=[]),
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> TrabajoOut:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")
    cover = next((image for image in trabajo.images if image.is_cover), None)
    if cover is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Trabajo has no cover image")
    return await replace_trabajo_imagen(trabajo_id, cover.id, alt=alt, files=files, _admin=_admin, db=db)


@router.delete("/{trabajo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trabajo(
    trabajo_id: uuid.UUID,
    _admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> None:
    trabajo = await _get_trabajo_with_images(db, trabajo_id)
    if trabajo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trabajo not found")

    old_keys = [key for image in trabajo.images for key in (image.image_key, image.thumbnail_key)]
    await db.delete(trabajo)
    try:
        await db.commit()
    except Exception as exc:
        logger.error("failed to delete trabajo %s: %s", trabajo_id, exc)
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete trabajo") from exc

    try:
        delete_objects(old_keys)
    except StorageError as exc:
        logger.warning("trabajo %s deleted but object cleanup failed: %s", trabajo_id, exc)
