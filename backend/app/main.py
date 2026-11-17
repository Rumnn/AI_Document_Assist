"""
AI Document Assistant – FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import engine
from app.api.v1.router import api_router

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan – startup and shutdown."""
    setup_logging()
    logger.info("Starting AI Document Assistant", env=settings.APP_ENV)
    # Future: initialize embedding model, Qdrant collection, MinIO bucket
    yield
    logger.info("Shutting down AI Document Assistant")
    await engine.dispose()


def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.APP_NAME,
        description="AI-powered Document Management and Knowledge Retrieval Platform",
        version="0.1.0",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        docs_url=f"{settings.API_V1_PREFIX}/docs",
        redoc_url=f"{settings.API_V1_PREFIX}/redoc",
        lifespan=lifespan,
    )

    # ── Middleware ─────────────────────────────────────────────────────────────
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if not settings.DEBUG:
        application.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=settings.ALLOWED_HOSTS,
        )

    # ── Routers ────────────────────────────────────────────────────────────────
    application.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # ── Health endpoints ───────────────────────────────────────────────────────
    @application.get("/health", tags=["Health"])
    async def health() -> dict:
        return {"status": "ok", "app": settings.APP_NAME}

    @application.get("/", tags=["Root"])
    async def root() -> dict:
        return {"message": f"Welcome to {settings.APP_NAME}"}

    return application


app = create_application()
