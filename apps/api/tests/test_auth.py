from __future__ import annotations

from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.routers import auth as auth_router


TEST_JWT_SECRET = "test-secret-for-auth-suite-with-32-bytes"


@pytest.fixture(autouse=True)
def oauth_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "allow_gmail", "admin@gmail.com")
    monkeypatch.setattr(settings, "google_client_id", "client-id.apps.googleusercontent.com")
    monkeypatch.setattr(settings, "google_client_secret", "client-secret")
    monkeypatch.setattr(settings, "google_redirect_uri", "http://testserver/api/admin/google/callback")
    monkeypatch.setattr(settings, "admin_login_redirect_url", "http://cms.local")
    monkeypatch.setattr(settings, "jwt_secret", TEST_JWT_SECRET)


def test_google_start_redirects_to_google_with_signed_state() -> None:
    with TestClient(app, follow_redirects=False) as client:
        res = client.get("/api/admin/google/start")

    assert res.status_code == 302
    location = res.headers["location"]
    parsed = urlparse(location)
    query = parse_qs(parsed.query)

    assert parsed.netloc == "accounts.google.com"
    assert query["client_id"] == [settings.google_client_id]
    assert query["redirect_uri"] == [settings.google_redirect_uri]
    assert query["scope"] == ["openid email"]
    auth_router._verify_state(query["state"][0])


def test_google_callback_issues_app_token_for_verified_allowed_email(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(auth_router, "exchange_google_code", lambda code: "id-token")
    monkeypatch.setattr(
        auth_router,
        "verify_google_id_token",
        lambda id_token: {"email": "ADMIN@gmail.com", "email_verified": True},
    )

    with TestClient(app, follow_redirects=False) as client:
        res = client.get(
            "/api/admin/google/callback",
            params={"code": "oauth-code", "state": auth_router._create_state()},
        )

    assert res.status_code == 302
    fragment = parse_qs(urlparse(res.headers["location"]).fragment)
    assert fragment["token_type"] == ["bearer"]
    token = fragment["access_token"][0]
    payload = auth_router._jwt().decode(token, TEST_JWT_SECRET, algorithms=["HS256"])
    assert payload["sub"] == "admin@gmail.com"
    assert payload["provider"] == "google"


def test_google_callback_rejects_unverified_email(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(auth_router, "exchange_google_code", lambda code: "id-token")
    monkeypatch.setattr(
        auth_router,
        "verify_google_id_token",
        lambda id_token: {"email": "admin@gmail.com", "email_verified": False},
    )

    with TestClient(app, follow_redirects=False) as client:
        res = client.get(
            "/api/admin/google/callback",
            params={"code": "oauth-code", "state": auth_router._create_state()},
        )

    assert res.status_code == 302
    assert parse_qs(urlparse(res.headers["location"]).fragment)["error"] == ["email_not_verified"]


def test_google_callback_rejects_non_allowlisted_email(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(auth_router, "exchange_google_code", lambda code: "id-token")
    monkeypatch.setattr(
        auth_router,
        "verify_google_id_token",
        lambda id_token: {"email": "other@gmail.com", "email_verified": True},
    )

    with TestClient(app, follow_redirects=False) as client:
        res = client.get(
            "/api/admin/google/callback",
            params={"code": "oauth-code", "state": auth_router._create_state()},
        )

    assert res.status_code == 302
    assert parse_qs(urlparse(res.headers["location"]).fragment)["error"] == ["email_not_allowed"]


def test_google_callback_rejects_invalid_state() -> None:
    with TestClient(app, follow_redirects=False) as client:
        res = client.get(
            "/api/admin/google/callback",
            params={"code": "oauth-code", "state": "invalid"},
        )

    assert res.status_code == 302
    assert parse_qs(urlparse(res.headers["location"]).fragment)["error"] == ["invalid_state"]
