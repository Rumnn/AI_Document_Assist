"""
FastAPI dependencies: authentication, current user, and workspace RBAC.
"""
import uuid
from typing import Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.models import User, Workspace, WorkspaceMember, WorkspaceRole
from app.repositories.user_repository import UserRepository
from app.repositories.workspace_repository import WorkspaceRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

ROLE_HIERARCHY: dict[WorkspaceRole, int] = {
    WorkspaceRole.owner: 40,
    WorkspaceRole.admin: 30,
    WorkspaceRole.member: 20,
    WorkspaceRole.viewer: 10,
}


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None or not user.is_active:
        raise credentials_exception
    return user


async def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return current_user


def require_workspace_role(min_role: WorkspaceRole) -> Callable:
    """
    Dependency factory that enforces workspace role-based access control (RBAC).
    Checks that:
      1. Target workspace exists.
      2. Authenticated user is a member (or superuser).
      3. User's role in this workspace satisfies min_role in the hierarchy:
         owner (40) >= admin (30) >= member (20) >= viewer (10)
    """
    async def _dependency(
        workspace_id: uuid.UUID,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
    ) -> WorkspaceMember:
        ws_repo = WorkspaceRepository(db)
        workspace = await ws_repo.get_by_id(workspace_id)
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )

        member = await ws_repo.get_member(workspace_id, current_user.id)
        if not member:
            if current_user.is_superuser:
                # Superusers have virtual owner role across all workspaces
                return WorkspaceMember(
                    workspace_id=workspace_id,
                    user_id=current_user.id,
                    role=WorkspaceRole.owner,
                )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a member of this workspace",
            )

        user_level = ROLE_HIERARCHY.get(member.role, 0)
        required_level = ROLE_HIERARCHY.get(min_role, 0)
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action requires '{min_role.value}' role or higher in this workspace",
            )
        return member

    return _dependency
