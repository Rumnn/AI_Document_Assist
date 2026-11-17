"""
Custom exception classes and global FastAPI exception handlers.
"""
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
import structlog

logger = structlog.get_logger(__name__)


# ── Domain exceptions ─────────────────────────────────────────────────────────

class AppError(Exception):
    """Base application error."""
    status_code: int = 500
    detail: str = "Internal server error"

    def __init__(self, detail: str | None = None, status_code: int | None = None):
        self.detail = detail or self.__class__.detail
        self.status_code = status_code or self.__class__.status_code
        super().__init__(self.detail)


class NotFoundError(AppError):
    status_code = 404
    detail = "Resource not found"


class ForbiddenError(AppError):
    status_code = 403
    detail = "Access denied"


class UnauthorizedError(AppError):
    status_code = 401
    detail = "Authentication required"


class ConflictError(AppError):
    status_code = 409
    detail = "Resource already exists"


class ValidationError(AppError):
    status_code = 422
    detail = "Validation failed"


class ServiceUnavailableError(AppError):
    status_code = 503
    detail = "Service temporarily unavailable"


# ── Handler registration ──────────────────────────────────────────────────────

def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        logger.warning(
            "Application error",
            status_code=exc.status_code,
            detail=exc.detail,
            path=request.url.path,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unexpected error", path=request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "An unexpected error occurred"},
        )
