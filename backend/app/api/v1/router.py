"""Main API v1 router – aggregates all domain routers."""
from fastapi import APIRouter

from app.api.v1.routers import auth, workspaces, documents, conversations, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["Conversations"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
