from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/servicios_pinamar"

    admin_username: str = "admin"
    admin_password_hash: str = ""
    jwt_secret: str = ""

    cors_origins: str = "https://cms.serviciospinamar.com,https://serviciospinamar.com,https://www.serviciospinamar.com"

    s3_endpoint_url: str = ""
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""
    s3_bucket: str = "serviciospinamar-fotos"
    s3_region: str = "us-east-1"
    s3_public_base_url: str = ""

    clerk_issuer_url: str = ""
    clerk_jwks_url: str = ""
    clerk_signing_keys: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def clerk_enabled(self) -> bool:
        return bool(self.clerk_issuer_url) and bool(self.clerk_jwks_url or self.clerk_signing_keys)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()