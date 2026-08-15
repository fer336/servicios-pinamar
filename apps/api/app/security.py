from __future__ import annotations

import logging
import time
from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)

LOCAL_TOKEN_TTL_SECONDS = 24 * 60 * 60


@dataclass
class AdminPrincipal:
    user_id: str
    provider: str


def _jwt_secret() -> str:
    if not settings.jwt_secret:
        raise RuntimeError("JWT_SECRET is not configured")
    return settings.jwt_secret


def _jwt():
    import jwt

    return jwt


def create_local_token(username: str) -> str:
    jwt = _jwt()
    now = int(time.time())
    payload = {
        "sub": username,
        "provider": "google",
        "iat": now,
        "exp": now + LOCAL_TOKEN_TTL_SECONDS,
    }
    return jwt.encode(payload, _jwt_secret(), algorithm="HS256")


def verify_local_token(token: str) -> AdminPrincipal:
    jwt = _jwt()
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc
    return AdminPrincipal(user_id=str(payload.get("sub", "")), provider=str(payload.get("provider", "")))


def is_allowed_admin_identity(username: str) -> bool:
    allowed = settings.allowed_admin_email
    return bool(allowed) and username.strip().lower() == allowed


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AdminPrincipal:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return verify_local_token(credentials.credentials)
