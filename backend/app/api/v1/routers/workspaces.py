"""Workspaces router – stub for Phase 1."""
from fastapi import APIRouter

router = APIRouter()

# Full implementation in Phase 2
@router.get("/")
async def list_workspaces():
    return {"message": "Workspaces endpoint – coming in Phase 2"}
