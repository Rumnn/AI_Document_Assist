"""Conversations router – stub for Phase 1."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_conversations():
    return {"message": "Conversations endpoint – coming in Phase 5"}
