"""
Workspaces router – CRUD and RBAC member management.
"""
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_workspace_role
from app.db.session import get_db
from app.models.models import User, WorkspaceRole, WorkspaceMember
from app.repositories.user_repository import UserRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse,
    WorkspaceDetailResponse,
    WorkspaceMemberResponse,
    WorkspaceMemberAdd,
    WorkspaceMemberUpdateRole,
)

router = APIRouter()


@router.post(
    "",
    response_model=WorkspaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workspace",
)
async def create_workspace(
    payload: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new workspace; creator automatically becomes the owner."""
    repo = WorkspaceRepository(db)
    workspace = await repo.create(name=payload.name, owner_id=current_user.id)
    return WorkspaceResponse(
        id=workspace.id,
        name=workspace.name,
        owner_id=workspace.owner_id,
        created_at=workspace.created_at,
        member_count=1,
        current_user_role=WorkspaceRole.owner,
    )


@router.get(
    "",
    response_model=List[WorkspaceResponse],
    summary="List workspaces for current user",
)
async def list_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all workspaces the authenticated user belongs to."""
    repo = WorkspaceRepository(db)
    workspaces_data = await repo.list_for_user(current_user.id)
    return [WorkspaceResponse(**item) for item in workspaces_data]


@router.get(
    "/{workspace_id}",
    response_model=WorkspaceDetailResponse,
    summary="Get workspace details",
)
async def get_workspace(
    workspace_id: uuid.UUID,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.viewer)),
    db: AsyncSession = Depends(get_db),
):
    """Get workspace details and member roster (accessible by any member)."""
    repo = WorkspaceRepository(db)
    workspace = await repo.get_by_id(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    members_data = await repo.list_members(workspace_id)
    return WorkspaceDetailResponse(
        id=workspace.id,
        name=workspace.name,
        owner_id=workspace.owner_id,
        created_at=workspace.created_at,
        member_count=len(members_data),
        current_user_role=membership.role,
        members=[WorkspaceMemberResponse(**m) for m in members_data],
    )


@router.patch(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
    summary="Update workspace",
)
async def update_workspace(
    workspace_id: uuid.UUID,
    payload: WorkspaceUpdate,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.admin)),
    db: AsyncSession = Depends(get_db),
):
    """Update workspace name (requires Admin or Owner)."""
    repo = WorkspaceRepository(db)
    workspace = await repo.get_by_id(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    updated = await repo.update(workspace, name=payload.name)
    members_data = await repo.list_members(workspace_id)
    return WorkspaceResponse(
        id=updated.id,
        name=updated.name,
        owner_id=updated.owner_id,
        created_at=updated.created_at,
        member_count=len(members_data),
        current_user_role=membership.role,
    )


@router.delete(
    "/{workspace_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete workspace",
)
async def delete_workspace(
    workspace_id: uuid.UUID,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.owner)),
    db: AsyncSession = Depends(get_db),
):
    """Permanently delete a workspace and its assets (requires Owner)."""
    repo = WorkspaceRepository(db)
    workspace = await repo.get_by_id(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    await repo.delete(workspace)
    return None


# ── Member Management ─────────────────────────────────────────────────────────

@router.get(
    "/{workspace_id}/members",
    response_model=List[WorkspaceMemberResponse],
    summary="List workspace members",
)
async def list_members(
    workspace_id: uuid.UUID,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.viewer)),
    db: AsyncSession = Depends(get_db),
):
    """List members and their roles in this workspace."""
    repo = WorkspaceRepository(db)
    members_data = await repo.list_members(workspace_id)
    return [WorkspaceMemberResponse(**m) for m in members_data]


@router.post(
    "/{workspace_id}/members",
    response_model=WorkspaceMemberResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add member to workspace",
)
async def add_member(
    workspace_id: uuid.UUID,
    payload: WorkspaceMemberAdd,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.admin)),
    db: AsyncSession = Depends(get_db),
):
    """Invite/add an existing user by email to the workspace (requires Admin or Owner)."""
    if payload.role == WorkspaceRole.owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot assign 'owner' role directly. Transfer ownership instead.",
        )

    user_repo = UserRepository(db)
    target_user = await user_repo.get_by_email(payload.email)
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email '{payload.email}' does not exist.",
        )

    ws_repo = WorkspaceRepository(db)
    existing_member = await ws_repo.get_member(workspace_id, target_user.id)
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member of this workspace.",
        )

    new_member = await ws_repo.add_member(
        workspace_id=workspace_id,
        user_id=target_user.id,
        role=payload.role,
    )

    return WorkspaceMemberResponse(
        id=new_member.id,
        workspace_id=workspace_id,
        user_id=target_user.id,
        email=target_user.email,
        full_name=target_user.full_name,
        avatar_url=target_user.avatar_url,
        role=new_member.role,
    )


@router.patch(
    "/{workspace_id}/members/{user_id}",
    response_model=WorkspaceMemberResponse,
    summary="Update member role",
)
async def update_member_role(
    workspace_id: uuid.UUID,
    user_id: uuid.UUID,
    payload: WorkspaceMemberUpdateRole,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.admin)),
    db: AsyncSession = Depends(get_db),
):
    """Change a member's role (Admin can change viewer/member; only Owner can change Admin)."""
    ws_repo = WorkspaceRepository(db)
    target_member = await ws_repo.get_member(workspace_id, user_id)
    if not target_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this workspace.",
        )

    if target_member.role == WorkspaceRole.owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change role of the workspace owner.",
        )

    # Admin cannot promote to Admin or modify another Admin unless caller is Owner
    if (
        payload.role == WorkspaceRole.admin or target_member.role == WorkspaceRole.admin
    ) and membership.role != WorkspaceRole.owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only workspace owners can promote or modify Admins.",
        )

    updated = await ws_repo.update_member_role(target_member, payload.role)
    user_repo = UserRepository(db)
    target_user = await user_repo.get_by_id(user_id)
    assert target_user is not None

    return WorkspaceMemberResponse(
        id=updated.id,
        workspace_id=workspace_id,
        user_id=target_user.id,
        email=target_user.email,
        full_name=target_user.full_name,
        avatar_url=target_user.avatar_url,
        role=updated.role,
    )


@router.delete(
    "/{workspace_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove member from workspace",
)
async def remove_member(
    workspace_id: uuid.UUID,
    user_id: uuid.UUID,
    membership: WorkspaceMember = Depends(require_workspace_role(WorkspaceRole.admin)),
    db: AsyncSession = Depends(get_db),
):
    """Remove a member from the workspace (Admin or Owner; Owner cannot be removed)."""
    ws_repo = WorkspaceRepository(db)
    target_member = await ws_repo.get_member(workspace_id, user_id)
    if not target_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this workspace.",
        )

    if target_member.role == WorkspaceRole.owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove the workspace owner.",
        )

    # Admin cannot remove another Admin unless caller is Owner
    if target_member.role == WorkspaceRole.admin and membership.role != WorkspaceRole.owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only workspace owners can remove an Admin.",
        )

    await ws_repo.remove_member(target_member)
    return None
