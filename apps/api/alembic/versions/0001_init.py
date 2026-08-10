"""Create trabajos table

Revision ID: 0001
Revises:
Create Date: 2026-08-09
"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "trabajos",
        sa.Column("id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("service", sa.Text(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("alt", sa.Text(), nullable=False, server_default=""),
        sa.Column("image_key", sa.Text(), nullable=False),
        sa.Column("thumbnail_key", sa.Text(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=False),
        sa.Column("thumbnail_url", sa.Text(), nullable=False),
        sa.Column("aspect_ratio", sa.Text(), nullable=False, server_default="4 / 3"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index(op.f("ix_trabajos_service"), "trabajos", ["service"], unique=False)
    op.create_index(op.f("ix_trabajos_created_at"), "trabajos", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_trabajos_service"), table_name="trabajos")
    op.drop_index(op.f("ix_trabajos_created_at"), table_name="trabajos")
    op.drop_table("trabajos")