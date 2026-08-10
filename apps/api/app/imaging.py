from __future__ import annotations

import io
import logging
from dataclasses import dataclass

from PIL import Image, ImageOps, UnidentifiedImageError

logger = logging.getLogger(__name__)

FULL_MAX_SIDE = 1920
FULL_MAX_BYTES = 300_000
FULL_QUALITY_START = 82
FULL_QUALITY_MIN = 60

THUMB_MAX_SIDE = 600
THUMB_MAX_BYTES = 100_000
THUMB_QUALITY = 80
THUMB_QUALITY_MIN = 60

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


class InvalidImageError(ValueError):
    pass


@dataclass
class ProcessedImage:
    data: bytes
    width: int
    height: int
    size_bytes: int
    format: str  # "webp"


def _identify(raw: bytes) -> Image.Image:
    if not raw:
        raise InvalidImageError("empty file")
    try:
        img = Image.open(io.BytesIO(raw))
        img.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise InvalidImageError("file is not a valid image") from exc
    fmt = (img.format or "").upper()
    if fmt not in ALLOWED_FORMATS:
        raise InvalidImageError(f"unsupported image format: {fmt or 'unknown'}")
    return img


def _to_rgb(img: Image.Image) -> Image.Image:
    if img.mode not in ("RGB", "L"):
        if img.mode == "RGBA" or img.mode == "LA" or (img.mode == "P" and "transparency" in img.info):
            img = img.convert("RGBA")
            background = Image.new("RGB", img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            return background
        img = img.convert("RGB")
    return img


def optimize_image(raw: bytes, *, max_side: int = FULL_MAX_SIDE) -> ProcessedImage:
    """Validate, fix EXIF orientation, downscale and recompress to WebP."""
    img = _identify(raw)
    img = ImageOps.exif_transpose(img)
    img = _to_rgb(img)
    original_size = img.size

    img.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    width, height = img.size

    data = _save_webp(img, FULL_QUALITY_START, FULL_MAX_BYTES, FULL_QUALITY_MIN)
    logger.info(
        "optimized image: %sx%s -> %sx%s, format=%s, size=%d bytes",
        original_size[0],
        original_size[1],
        width,
        height,
        "webp",
        len(data),
    )
    return ProcessedImage(data=data, width=width, height=height, size_bytes=len(data), format="webp")


def optimize_thumbnail(processed: ProcessedImage, *, max_side: int = THUMB_MAX_SIDE) -> ProcessedImage:
    """Build a small WebP thumbnail from an already-optimized full image."""
    img = Image.open(io.BytesIO(processed.data))
    img = _to_rgb(img)
    img.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    width, height = img.size

    data = _save_webp(img, THUMB_QUALITY, THUMB_MAX_BYTES, THUMB_QUALITY_MIN)
    return ProcessedImage(data=data, width=width, height=height, size_bytes=len(data), format="webp")


def _save_webp(img: Image.Image, quality: int, max_bytes: int, min_quality: int) -> bytes:
    q = quality
    while True:
        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=q, method=4, exif=b"")
        data = buf.getvalue()
        if len(data) <= max_bytes or q <= min_quality:
            return data
        q -= 5