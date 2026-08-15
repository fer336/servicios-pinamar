from __future__ import annotations

import logging
import mimetypes
from functools import lru_cache
from urllib.parse import quote

from app.core.config import settings

logger = logging.getLogger(__name__)


class StorageError(RuntimeError):
    pass


class StorageNotFound(StorageError):
    pass


@lru_cache
def get_s3_client():
    import boto3
    from botocore.config import Config

    if not settings.s3_endpoint_url or not settings.s3_access_key_id or not settings.s3_secret_access_key:
        raise RuntimeError("S3 credentials are not configured")
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.s3_access_key_id,
        aws_secret_access_key=settings.s3_secret_access_key,
        region_name=settings.s3_region,
        config=Config(signature_version="s3v4"),
    )


def public_url(object_key: str) -> str:
    path = quote(object_key.lstrip("/"), safe="/")
    base = settings.public_api_base_url.rstrip("/")
    if not base:
        return f"/api/media/{path}"
    return f"{base}/api/media/{path}"


def get_object(object_key: str) -> tuple[bytes, str]:
    try:
        response = get_s3_client().get_object(Bucket=settings.s3_bucket, Key=object_key)
        body = response["Body"].read()
    except Exception as exc:
        error = getattr(exc, "response", {}).get("Error", {})
        code = error.get("Code")
        if code in {"NoSuchKey", "404", "NotFound"}:
            raise StorageNotFound(f"object not found: {object_key}") from exc
        logger.error("failed to read %s: %s", object_key, exc)
        raise StorageError(f"failed to read {object_key}") from exc
    guessed_type = mimetypes.guess_type(object_key)[0]
    content_type = response.get("ContentType")
    if not content_type or content_type == "application/octet-stream":
        content_type = guessed_type or "application/octet-stream"
    return body, content_type


def put_object(object_key: str, data: bytes, content_type: str = "image/webp") -> None:
    try:
        get_s3_client().put_object(
            Bucket=settings.s3_bucket,
            Key=object_key,
            Body=data,
            ContentType=content_type,
        )
    except Exception as exc:
        logger.error("failed to upload %s: %s", object_key, exc)
        raise StorageError(f"failed to upload {object_key}") from exc
    logger.info("uploaded %s (%d bytes)", object_key, len(data))


def delete_objects(object_keys: list[str]) -> None:
    keys = [key for key in object_keys if key]
    if not keys:
        return
    try:
        get_s3_client().delete_objects(
            Bucket=settings.s3_bucket,
            Delete={"Objects": [{"Key": key} for key in keys]},
        )
    except Exception as exc:
        logger.error("failed to delete %s: %s", keys, exc)
        raise StorageError("failed to delete objects") from exc
    logger.info("deleted %d object(s): %s", len(keys), keys)
