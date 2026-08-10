from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.schemas import AdminLoginRequest, AdminLoginResponse
from app.security import create_local_token, verify_local_credentials

router = APIRouter(prefix="/admin", tags=["auth"])


@router.post(
    "/login",
    response_model=AdminLoginResponse,
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "Local admin login"}, 403: {"description": "Clerk is configured"}},
)
async def admin_login(payload: AdminLoginRequest) -> AdminLoginResponse:
    if settings.clerk_enabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Clerk authentication is configured; local login is disabled",
        )
    if not verify_local_credentials(payload.username, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_local_token(payload.username)
    return AdminLoginResponse(access_token=token)