from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


def to_camel(snake: str) -> str:
    head, *tail = snake.split("_")
    return head + "".join(part.capitalize() for part in tail)


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class TrabajoImageOut(ApiModel):
    id: UUID
    image_url: str
    thumbnail_url: str
    alt: str
    aspect_ratio: str
    sort_order: int
    is_cover: bool
    created_at: datetime


class TrabajoOut(ApiModel):
    id: UUID
    title: str
    description: str
    thumbnail_url: str
    image_url: str
    alt: str
    aspect_ratio: str
    service: str
    sort_order: int
    created_at: datetime
    images: list[TrabajoImageOut] = Field(default_factory=list)


class TrabajoListResponse(ApiModel):
    items: list[TrabajoOut]
    page: int
    limit: int
    total: int
    has_more: bool


class TrabajoUpdate(ApiModel):
    title: str | None = Field(default=None, min_length=1, max_length=300)
    description: str | None = Field(default=None, max_length=2000)
    alt: str | None = Field(default=None, max_length=500)
    service: str | None = Field(default=None, min_length=1, max_length=50)
    aspect_ratio: str | None = Field(default=None, max_length=30)
    orden: int | None = None


class TrabajoImageReorder(ApiModel):
    image_ids: list[UUID] = Field(min_length=1)


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(ApiModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


class ErrorResponse(ApiModel):
    detail: str
