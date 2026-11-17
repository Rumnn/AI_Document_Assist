"""
Central application configuration using pydantic-settings.
All values can be overridden via environment variables or a .env file.
"""
from functools import lru_cache
import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────────
    APP_NAME: str = "AI Document Assistant"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "CHANGE_ME"
    ALLOWED_ORIGINS: Union[str, List[str]] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    ALLOWED_HOSTS: Union[str, List[str]] = ["*"]

    # ── JWT ───────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "CHANGE_ME_JWT_SECRET"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://aid_user:aid_secret@localhost:5432/ai_document"

    # ── Redis ─────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://:redis_secret@localhost:6379/0"

    # ── Qdrant ────────────────────────────────────────────────────────────────
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION_NAME: str = "documents"

    # ── MinIO ─────────────────────────────────────────────────────────────────
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ROOT_USER: str = "minio_admin"
    MINIO_ROOT_PASSWORD: str = "minio_secret"
    MINIO_BUCKET_NAME: str = "ai-documents"
    MINIO_SECURE: bool = False

    # ── Gemini ────────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-pro"
    GEMINI_EMBEDDING_MODEL: str = "text-embedding-004"

    # ── Embedding ─────────────────────────────────────────────────────────────
    BGE_MODEL_NAME: str = "BAAI/bge-m3"
    BGE_RERANKER_NAME: str = "BAAI/bge-reranker-v2-m3"
    EMBEDDING_DEVICE: str = "cpu"
    EMBEDDING_BATCH_SIZE: int = 32
    EMBEDDING_DIMENSIONS: int = 1024

    # ── Document Processing ───────────────────────────────────────────────────
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: Union[str, List[str]] = ["pdf", "docx", "txt"]
    CHUNK_SIZE_TOKENS: int = 700
    CHUNK_OVERLAP_TOKENS: int = 100
    MIN_CHUNK_SIZE_TOKENS: int = 100
    MAX_CHUNK_SIZE_TOKENS: int = 1000

    # ── RAG ───────────────────────────────────────────────────────────────────
    DENSE_RETRIEVAL_TOP_K: int = 20
    SPARSE_RETRIEVAL_TOP_K: int = 20
    RERANKER_TOP_K: int = 8

    # ── Celery ────────────────────────────────────────────────────────────────
    CELERY_BROKER_URL: str = "redis://:redis_secret@localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://:redis_secret@localhost:6379/1"

    @field_validator("ALLOWED_ORIGINS", "ALLOWED_HOSTS", "ALLOWED_EXTENSIONS", mode="after")
    @classmethod
    def parse_to_list(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed]
                except Exception:
                    pass
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    @property
    def MAX_FILE_SIZE_BYTES(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
