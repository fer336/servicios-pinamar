from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "/run/secrets/servicios_env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/servicios_pinamar"

    allow_gmail: str = ""
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = ""
    admin_login_redirect_url: str = "http://localhost:5173"
    jwt_secret: str = ""

    cors_origins: str = "https://cms.serviciospinamar.com,https://serviciospinamar.com,https://www.serviciospinamar.com"

    s3_endpoint_url: str = ""
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""
    s3_bucket: str = "serviciospinamar-fotos"
    s3_region: str = "us-east-1"
    s3_public_base_url: str = ""
    public_api_base_url: str = "https://cms.serviciospinamar.com"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def allowed_admin_email(self) -> str:
        return self.allow_gmail.strip().lower()


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
