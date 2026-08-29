from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/lexguard"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "dev-only-change-me-please-32-characters"
    cors_origins: list[str] = ["http://localhost:3000"]
    upload_max_bytes: int = 25_000_000
    upload_dir: str = "./data/uploads"
    ollama_base_url: str = "http://host.docker.internal:11434"
    ollama_model: str = "qwen2.5-vl"
    ollama_timeout_seconds: int = 120
    ollama_enabled: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
