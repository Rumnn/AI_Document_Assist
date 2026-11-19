"""Workspace repository – database operations for Workspaces and Memberships."""
import uuid
from typing import Optional, List, Tuple
from sqlalchemy import select, func, delete
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Workspace, WorkspaceMember, WorkspaceRole, User


class WorkspaceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, name: str, owner_id: uuid.UUID) -> Workspace:
        """Create a workspace and automatically register the creator as owner member."""
        workspace = Workspace(name=name, owner_id=owner_id)
        self.db.add(workspace)
        await self.db.flush()

        member = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=owner_id,
            role=WorkspaceRole.owner,
        )
        self.db.add(member)
        await self.db.commit()
        await self.db.refresh(workspace)
        return workspace

    async def get_by_id(self, workspace_id: uuid.UUID) -> Optional[Workspace]:
        result = await self.db.execute(
            select(Workspace)
            .options(
                selectinload(Workspace.members).joinedload(WorkspaceMember.user)
            )
            .where(Workspace.id == workspace_id)
        )
        return result.scalar_one_or_none()

    async def list_for_user(self, user_id: uuid.UUID) -> List[dict]:
        """
        List all workspaces the user belongs to, including their role
        and total member count.
        """
        # Subquery for member count
        count_subq = (
            select(
                WorkspaceMember.workspace_id,
                func.count(WorkspaceMember.id).label("member_count"),
            )
            .group_by(WorkspaceMember.workspace_id)
            .subquery()
        )

        stmt = (
            select(
                Workspace,
                WorkspaceMember.role.label("user_role"),
                func.coalesce(count_subq.c.member_count, 1).label("member_count"),
            )
            .join(WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id)
            .outerjoin(count_subq, Workspace.id == count_subq.c.workspace_id)
            .where(WorkspaceMember.user_id == user_id)
            .order_by(Workspace.created_at.desc())
        )

        result = await self.db.execute(stmt)
        rows = result.all()

        workspaces_data = []
        for ws, role, count in rows:
            workspaces_data.append({
                "id": ws.id,
                "name": ws.name,
                "owner_id": ws.owner_id,
                "created_at": ws.created_at,
                "member_count": count,
                "current_user_role": role,
            })
        return workspaces_data

    async def update(self, workspace: Workspace, **kwargs) -> Workspace:
        for key, value in kwargs.items():
            if value is not None:
                setattr(workspace, key, value)
        await self.db.commit()
        await self.db.refresh(workspace)
        return workspace

    async def delete(self, workspace: Workspace) -> None:
        await self.db.delete(workspace)
        await self.db.commit()

    async def get_member(
        self, workspace_id: uuid.UUID, user_id: uuid.UUID
    ) -> Optional[WorkspaceMember]:
        result = await self.db.execute(
            select(WorkspaceMember)
            .options(joinedload(WorkspaceMember.user))
            .where(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_members(self, workspace_id: uuid.UUID) -> List[dict]:
        stmt = (
            select(WorkspaceMember, User)
            .join(User, WorkspaceMember.user_id == User.id)
            .where(WorkspaceMember.workspace_id == workspace_id)
            .order_by(WorkspaceMember.role.asc(), User.full_name.asc())
        )
        result = await self.db.execute(stmt)
        members_data = []
        for member, user in result.all():
            members_data.append({
                "id": member.id,
                "workspace_id": member.workspace_id,
                "user_id": member.user_id,
                "email": user.email,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "role": member.role,
            })
        return members_data

    async def add_member(
        self, workspace_id: uuid.UUID, user_id: uuid.UUID, role: WorkspaceRole
    ) -> WorkspaceMember:
        member = WorkspaceMember(
            workspace_id=workspace_id,
            user_id=user_id,
            role=role,
        )
        self.db.add(member)
        await self.db.commit()
        await self.db.refresh(member)
        return member

    async def update_member_role(
        self, member: WorkspaceMember, role: WorkspaceRole
    ) -> WorkspaceMember:
        member.role = role
        await self.db.commit()
        await self.db.refresh(member)
        return member

    async def remove_member(self, member: WorkspaceMember) -> None:
        await self.db.delete(member)
        await self.db.commit()
