"""Documents router – stub for Phase 1."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_documents():
    return {"message": "Documents endpoint – coming in Phase 3"}
