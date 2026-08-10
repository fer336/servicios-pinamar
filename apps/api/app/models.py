from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Trabajo(Base):
    __tablename__ = "trabajos"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    service: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    alt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    image_key: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_key: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(Text, nullable=False)
    aspect_ratio: Mapped[str] = mapped_column(Text, nullable=False, default="4 / 3")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )
    images: Mapped[list[TrabajoImagen]] = relationship(
        back_populates="trabajo",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="TrabajoImagen.sort_order",
    )


class TrabajoImagen(Base):
    __tablename__ = "trabajo_imagenes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    trabajo_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("trabajos.id", ondelete="CASCADE"), nullable=False
    )
    image_key: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_key: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(Text, nullable=False)
    alt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    aspect_ratio: Mapped[str] = mapped_column(Text, nullable=False, default="4 / 3")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_cover: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    trabajo: Mapped[Trabajo] = relationship(back_populates="images")


Index("ix_trabajo_imagenes_trabajo_sort", TrabajoImagen.trabajo_id, TrabajoImagen.sort_order)
Index(
    "uq_trabajo_imagenes_one_cover",
    TrabajoImagen.trabajo_id,
    unique=True,
    postgresql_where=TrabajoImagen.is_cover,
    sqlite_where=TrabajoImagen.is_cover,
)
