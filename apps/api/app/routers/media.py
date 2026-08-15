from __future__ import annotations

from fastapi import APIRouter, HTTPException, Response, status

from app.storage import StorageError, StorageNotFound, get_object

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/{object_key:path}", status_code=status.HTTP_200_OK)
async def get_media(object_key: str) -> Response:
    parts = object_key.split("/")
    if not object_key or any(part in {"", ".", ".."} for part in parts):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")
    try:
        body, content_type = get_object(object_key)
    except StorageNotFound as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found") from exc
    except StorageError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="failed to read media") from exc
    return Response(
        content=body,
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
        },
    )
