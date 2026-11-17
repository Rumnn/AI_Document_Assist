"""AI router – stub for Phase 1."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def ai_root():
    return {"message": "AI endpoints – coming in Phase 5"}
