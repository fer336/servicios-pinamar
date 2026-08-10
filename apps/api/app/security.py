from __future__ import annotations

import json
import logging
import time
import urllib.request
from dataclasses import dataclass
from typing import Any

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)

LOCAL_TOKEN_TTL_SECONDS = 24 * 60 * 60
JWKS_CACHE_TTL_SECONDS = 10 * 60


@dataclass
class AdminPrincipal:
    user_id: str
    provider: str  # "clerk" | "local"


def _jwt_secret() -> str:
    if not settings.jwt_secret:
        raise RuntimeError("JWT_SECRET is not configured")
    return settings.jwt_secret


def _jwt():
    import jwt

    return jwt


# ---------------------------------------------------------------------------
# Local admin fallback (active only when Clerk is not configured)
# ---------------------------------------------------------------------------

def create_local_token(username: str) -> str:
    jwt = _jwt()
    now = int(time.time())
    payload = {
        "sub": username,
        "provider": "local",
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
    return AdminPrincipal(user_id=str(payload.get("sub", "")), provider="local")


def verify_local_credentials(username: str, password: str) -> bool:
    if not settings.admin_password_hash:
        logger.error("ADMIN_PASSWORD_HASH is not configured")
        return False
    try:
        return bcrypt.checkpw(password.encode(), settings.admin_password_hash.encode())
    except ValueError:
        logger.error("ADMIN_PASSWORD_HASH is not a valid bcrypt hash")
        return False


# ---------------------------------------------------------------------------
# Clerk JWT verification (JWKS fetched over HTTPS, cached)
# ---------------------------------------------------------------------------

_jwks_cache: dict[str, tuple[float, dict[str, Any]]] = {}
_signing_key_cache: dict[str, Any] = {}


def _fetch_jwks() -> dict[str, Any]:
    url = settings.clerk_jwks_url
    if not url:
        raise RuntimeError("CLERK_JWKS_URL is not configured")
    now = time.time()
    cached = _jwks_cache.get(url)
    if cached and now - cached[0] < JWKS_CACHE_TTL_SECONDS:
        return cached[1]
    with urllib.request.urlopen(url, timeout=10) as resp:
        jwks = json.loads(resp.read().decode("utf-8"))
    _jwks_cache[url] = (now, jwks)
    return jwks


def _resolve_public_key(header: dict[str, Any]):
    kid = header.get("kid")
    signing_keys = settings.clerk_signing_keys.strip() if settings.clerk_signing_keys else ""

    if signing_keys.startswith("-----BEGIN"):
        jwt = _jwt()
        from jwt.algorithms import RSAAlgorithm

        cache_key = kid or "pem"
        if cache_key not in _signing_key_cache:
            _signing_key_cache[cache_key] = RSAAlgorithm.from_string(signing_keys)
        return _signing_key_cache[cache_key]

    if signing_keys:
        try:
            jwk_dict = json.loads(signing_keys)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="CLERK_SIGNING_KEYS is not a valid JWK or PEM key",
            )
        if isinstance(jwk_dict, list):
            jwk_dict = next((k for k in jwk_dict if k.get("kid") == kid), jwk_dict[0] if jwk_dict else {})
    else:
        jwks = _fetch_jwks()
        keys = jwks.get("keys", [])
        jwk_dict = next((k for k in keys if k.get("kid") == kid), keys[0] if keys else {})

    if not jwk_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No matching signing key found",
        )
    cache_key = jwk_dict.get("kid", "key")
    if cache_key not in _signing_key_cache:
        jwt = _jwt()
        from jwt.jwk import PyJWK

        _signing_key_cache[cache_key] = PyJWK(jwk_dict).key
    return _signing_key_cache[cache_key]


def verify_clerk_token(token: str) -> AdminPrincipal:
    jwt = _jwt()
    try:
        header = jwt.get_unverified_header(token)
        key = _resolve_public_key(header)
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=settings.clerk_issuer_url,
            options={"verify_aud": False},
        )
    except HTTPException:
        raise
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc
    return AdminPrincipal(user_id=str(payload.get("sub", "")), provider="clerk")


# ---------------------------------------------------------------------------
# Dependency for protected routes
# ---------------------------------------------------------------------------

def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AdminPrincipal:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if settings.clerk_enabled:
        return verify_clerk_token(credentials.credentials)
    return verify_local_token(credentials.credentials)
