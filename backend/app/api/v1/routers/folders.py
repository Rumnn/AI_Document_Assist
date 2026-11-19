"""Folders router – folder organization and hierarchy within workspaces."""
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_workspace_role
from app.db.session import get_db
from app.models.models import User, WorkspaceRole
from app.repositories.folder_repository import FolderRepository
from app.schemas.folder import FolderCreate, FolderUpdate, FolderResponse

router = APIRouter()


@router.post(
    "",
    response_model=FolderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create folder",
)
async def create_folder(
    payload: FolderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify user has at least 'member' role in the target workspace
    check_role = require_workspace_role(WorkspaceRole.member)
    await check_role(workspace_id=payload.workspace_id, current_user=current_user, db=db)

    repo = FolderRepository(db)
    if payload.parent_id:
        parent = await repo.get_by_id(payload.parent_id)
        if not parent or parent.workspace_id != payload.workspace_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent folder not found in this workspace.",
            )

    folder = await repo.create(
        workspace_id=payload.workspace_id,
        name=payload.name,
        parent_id=payload.parent_id,
    )
    return FolderResponse(
        id=folder.id,
        workspace_id=folder.workspace_id,
        name=folder.name,
        parent_id=folder.parent_id,
        document_count=0,
    )


@router.get(
    "",
    response_model=List[FolderResponse],
    summary="List folders in workspace",
)
async def list_folders(
    workspace_id: uuid.UUID = Query(..., description="Target workspace ID"),
    parent_id: Optional[uuid.UUID] = Query(None, description="Filter by parent folder ID"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify user has at least 'viewer' role in the target workspace
    check_role = require_workspace_role(WorkspaceRole.viewer)
    await check_role(workspace_id=workspace_id, current_user=current_user, db=db)

    repo = FolderRepository(db)
    folders_data = await repo.list_by_workspace(workspace_id=workspace_id, parent_id=parent_id)
    return [FolderResponse(**f) for f in folders_data]


@router.patch(
    "/{folder_id}",
    response_model=FolderResponse,
    summary="Update folder",
)
async def update_folder(
    folder_id: uuid.UUID,
    payload: FolderUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = FolderRepository(db)
    folder = await repo.get_by_id(folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found.")

    check_role = require_workspace_role(WorkspaceRole.member)
    await check_role(workspace_id=folder.workspace_id, current_user=current_user, db=db)

    if payload.parent_id and payload.parent_id == folder_id:
        raise HTTPException(status_code=400, detail="A folder cannot be its own parent.")

    updated = await repo.update(folder, name=payload.name, parent_id=payload.parent_id)
    return FolderResponse(
        id=updated.id,
        workspace_id=updated.workspace_id,
        name=updated.name,
        parent_id=updated.parent_id,
        document_count=0,
    )


@router.delete(
    "/{folder_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete folder",
)
async def delete_folder(
    folder_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = FolderRepository(db)
    folder = await repo.get_by_id(folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found.")

    check_role = require_workspace_role(WorkspaceRole.admin)
    await check_role(workspace_id=folder.workspace_id, current_user=current_user, db=db)

    await repo.delete(folder)
    return None
