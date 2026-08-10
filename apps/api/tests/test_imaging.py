from __future__ import annotations

import io

from PIL import Image

from app.imaging import (
    FULL_MAX_BYTES,
    FULL_MAX_SIDE,
    InvalidImageError,
    THUMB_MAX_BYTES,
    THUMB_MAX_SIDE,
    optimize_image,
    optimize_thumbnail,
)


def make_test_image(width: int = 3000, height: int = 4000) -> bytes:
    img = Image.new("RGB", (width, height), (30, 60, 120))
    for x in range(0, width, 16):
        shade = (x * 255) // width
        img.paste((shade, 60, 200 - shade), (x, 0, x + 16, height))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()


def test_optimize_full_downsizes_to_max_side() -> None:
    raw = make_test_image(3000, 4000)
    result = optimize_image(raw)
    assert result.width == 1440
    assert result.height == 1920
    assert result.format == "webp"
    assert result.size_bytes > 0
    assert result.width <= FULL_MAX_SIDE and result.height <= FULL_MAX_SIDE
    assert result.size_bytes < FULL_MAX_BYTES


def test_thumbnail_dimensions_and_size() -> None:
    raw = make_test_image(3000, 4000)
    full = optimize_image(raw)
    thumb = optimize_thumbnail(full)
    assert thumb.width == 450
    assert thumb.height == 600
    assert thumb.format == "webp"
    assert thumb.width <= THUMB_MAX_SIDE and thumb.height <= THUMB_MAX_SIDE
    assert thumb.size_bytes < THUMB_MAX_BYTES


def test_small_image_is_not_upscaled() -> None:
    raw = make_test_image(800, 600)
    full = optimize_image(raw)
    assert full.width == 800
    assert full.height == 600


def test_keeps_aspect_ratio() -> None:
    raw = make_test_image(2000, 1000)
    full = optimize_image(raw)
    assert full.width == 1920
    assert full.height == 960


def test_rejects_non_image_data() -> None:
    import pytest

    with pytest.raises(InvalidImageError):
        optimize_image(b"this is definitely not an image payload" * 100)


def test_rejects_empty_file() -> None:
    import pytest

    with pytest.raises(InvalidImageError):
        optimize_image(b"")


def test_webp_input_is_accepted() -> None:
    buf = io.BytesIO()
    Image.new("RGB", (10, 10), "white").save(buf, format="WEBP")
    result = optimize_image(buf.getvalue())
    assert result.format == "webp"
    assert (result.width, result.height) == (10, 10)