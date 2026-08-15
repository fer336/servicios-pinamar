from __future__ import annotations

import json
import time
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import APIRouter, Query, status
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.security import create_local_token, is_allowed_admin_identity

router = APIRouter(prefix="/admin", tags=["auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs"
GOOGLE_ISSUERS = {"https://accounts.google.com", "accounts.google.com"}
OAUTH_STATE_TTL_SECONDS = 10 * 60


class GoogleOAuthError(Exception):
    def __init__(self, code: str) -> None:
        self.code = code
        super().__init__(code)


def _jwt():
    import jwt

    return jwt


def _require_google_config() -> None:
    if not settings.allow_gmail:
        raise GoogleOAuthError("missing_allowlist")
    if not settings.google_client_id:
        raise GoogleOAuthError("missing_google_client_id")
    if not settings.google_client_secret:
        raise GoogleOAuthError("missing_google_client_secret")
    if not settings.google_redirect_uri:
        raise GoogleOAuthError("missing_google_redirect_uri")
    if not settings.jwt_secret:
        raise GoogleOAuthError("missing_jwt_secret")


def _create_state() -> str:
    now = int(time.time())
    payload = {"typ": "google_oauth_state", "iat": now, "exp": now + OAUTH_STATE_TTL_SECONDS}
    return _jwt().encode(payload, settings.jwt_secret, algorithm="HS256")


def _verify_state(state: str) -> None:
    jwt = _jwt()
    try:
        payload = jwt.decode(state, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise GoogleOAuthError("invalid_state") from exc
    if payload.get("typ") != "google_oauth_state":
        raise GoogleOAuthError("invalid_state")


def _redirect_to_cms(params: dict[str, str]) -> RedirectResponse:
    base_url = settings.admin_login_redirect_url.rstrip("/") or "http://localhost:5173"
    fragment = urlencode(params)
    return RedirectResponse(f"{base_url}/#{fragment}", status_code=status.HTTP_302_FOUND)


def _fetch_json(url: str, data: dict[str, str] | None = None) -> dict[str, Any]:
    body = urlencode(data).encode() if data is not None else None
    request = Request(
        url,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST" if data is not None else "GET",
    )
    with urlopen(request, timeout=10) as response:  # nosec B310: fixed Google OAuth endpoints.
        return json.loads(response.read().decode("utf-8"))


def exchange_google_code(code: str) -> str:
    token_response = _fetch_json(
        GOOGLE_TOKEN_URL,
        {
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": settings.google_redirect_uri,
            "grant_type": "authorization_code",
        },
    )
    id_token = token_response.get("id_token")
    if not isinstance(id_token, str) or not id_token:
        raise GoogleOAuthError("missing_id_token")
    return id_token


def verify_google_id_token(id_token: str) -> dict[str, Any]:
    jwt = _jwt()
    try:
        header = jwt.get_unverified_header(id_token)
        key_id = header.get("kid")
        jwks = _fetch_json(GOOGLE_JWKS_URL)
        key_data = next(
            (key for key in jwks.get("keys", []) if isinstance(key, dict) and key.get("kid") == key_id),
            None,
        )
        if key_data is None:
            raise GoogleOAuthError("invalid_id_token")
        signing_key = jwt.PyJWK.from_dict(key_data).key
        return jwt.decode(
            id_token,
            signing_key,
            algorithms=["RS256"],
            audience=settings.google_client_id,
            issuer=GOOGLE_ISSUERS,
        )
    except GoogleOAuthError:
        raise
    except jwt.PyJWTError as exc:
        raise GoogleOAuthError("invalid_id_token") from exc


@router.get("/google/start", status_code=status.HTTP_302_FOUND)
async def google_start() -> RedirectResponse:
    try:
        _require_google_config()
        query = urlencode(
            {
                "client_id": settings.google_client_id,
                "redirect_uri": settings.google_redirect_uri,
                "response_type": "code",
                "scope": "openid email",
                "state": _create_state(),
                "access_type": "online",
                "prompt": "select_account",
            }
        )
        return RedirectResponse(f"{GOOGLE_AUTH_URL}?{query}", status_code=status.HTTP_302_FOUND)
    except GoogleOAuthError as exc:
        return _redirect_to_cms({"error": exc.code})


@router.get("/google/callback", status_code=status.HTTP_302_FOUND)
async def google_callback(
    code: str | None = Query(default=None),
    state: str | None = Query(default=None),
    error: str | None = Query(default=None),
) -> RedirectResponse:
    if error:
        return _redirect_to_cms({"error": "google_denied"})
    if not code or not state:
        return _redirect_to_cms({"error": "missing_code"})

    try:
        _require_google_config()
        _verify_state(state)
        id_token = exchange_google_code(code)
        identity = verify_google_id_token(id_token)
        email = str(identity.get("email", "")).strip().lower()
        if identity.get("email_verified") is not True:
            raise GoogleOAuthError("email_not_verified")
        if not is_allowed_admin_identity(email):
            raise GoogleOAuthError("email_not_allowed")
        return _redirect_to_cms({"access_token": create_local_token(email), "token_type": "bearer"})
    except GoogleOAuthError as exc:
        return _redirect_to_cms({"error": exc.code})
    except Exception:
        return _redirect_to_cms({"error": "oauth_failed"})
