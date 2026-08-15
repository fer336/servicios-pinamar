from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, media, trabajos

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)


_app_instance: FastAPI | None = None


def create_app() -> FastAPI:
    global _app_instance
    if _app_instance is not None:
        return _app_instance
    app = FastAPI(
        title="Servicios Pinamar API",
        version="1.0.0",
        description="Backend for the Servicios Pinamar gallery. Public reads, authenticated writes.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    app.include_router(trabajos.router, prefix="/api")
    app.include_router(media.router, prefix="/api")
    app.include_router(auth.router, prefix="/api")

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}
    logger.info("auth mode: google-oauth-jwt")
    _app_instance = app
    return app


app = create_app()
