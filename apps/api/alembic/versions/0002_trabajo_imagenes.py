"""Create trabajo_imagenes gallery table

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-09
"""
from alembic import op
import sqlalchemy as sa

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "trabajo_imagenes",
        sa.Column("id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("trabajo_id", sa.Uuid(), sa.ForeignKey("trabajos.id", ondelete="CASCADE"), nullable=False),
        sa.Column("image_key", sa.Text(), nullable=False),
        sa.Column("thumbnail_key", sa.Text(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=False),
        sa.Column("thumbnail_url", sa.Text(), nullable=False),
        sa.Column("alt", sa.Text(), nullable=False, server_default=""),
        sa.Column("aspect_ratio", sa.Text(), nullable=False, server_default="4 / 3"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_cover", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index(
        "ix_trabajo_imagenes_trabajo_sort",
        "trabajo_imagenes",
        ["trabajo_id", "sort_order"],
        unique=False,
    )
    op.create_index(
        "uq_trabajo_imagenes_one_cover",
        "trabajo_imagenes",
        ["trabajo_id"],
        unique=True,
        postgresql_where=sa.text("is_cover"),
    )
    op.execute(
        """
        INSERT INTO trabajo_imagenes (
            trabajo_id,
            image_key,
            thumbnail_key,
            image_url,
            thumbnail_url,
            alt,
            aspect_ratio,
            sort_order,
            is_cover,
            created_at,
            updated_at
        )
        SELECT
            id,
            image_key,
            thumbnail_key,
            image_url,
            thumbnail_url,
            alt,
            aspect_ratio,
            0,
            true,
            created_at,
            updated_at
        FROM trabajos
        """
    )


def downgrade() -> None:
    op.drop_index("uq_trabajo_imagenes_one_cover", table_name="trabajo_imagenes")
    op.drop_index("ix_trabajo_imagenes_trabajo_sort", table_name="trabajo_imagenes")
    op.drop_table("trabajo_imagenes")
