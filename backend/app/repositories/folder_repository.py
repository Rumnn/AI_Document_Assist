"""Folder repository – database operations for Folder model."""
import uuid
from typing import Optional, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Folder, Document


class FolderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        workspace_id: uuid.UUID,
        name: str,
        parent_id: Optional[uuid.UUID] = None,
    ) -> Folder:
        folder = Folder(workspace_id=workspace_id, name=name, parent_id=parent_id)
        self.db.add(folder)
        await self.db.commit()
        await self.db.refresh(folder)
        return folder

    async def get_by_id(self, folder_id: uuid.UUID) -> Optional[Folder]:
        result = await self.db.execute(select(Folder).where(Folder.id == folder_id))
        return result.scalar_one_or_none()

    async def list_by_workspace(
        self, workspace_id: uuid.UUID, parent_id: Optional[uuid.UUID] = None
    ) -> List[dict]:
        """List folders in workspace along with their document count."""
        count_subq = (
            select(
                Document.folder_id,
                func.count(Document.id).label("doc_count"),
            )
            .where(Document.workspace_id == workspace_id)
            .group_by(Document.folder_id)
            .subquery()
        )

        query = (
            select(Folder, func.coalesce(count_subq.c.doc_count, 0).label("doc_count"))
            .outerjoin(count_subq, Folder.id == count_subq.c.folder_id)
            .where(Folder.workspace_id == workspace_id)
        )
        if parent_id is not None:
            query = query.where(Folder.parent_id == parent_id)

        query = query.order_by(Folder.name.asc())
        result = await self.db.execute(query)

        folders_data = []
        for folder, count in result.all():
            folders_data.append({
                "id": folder.id,
                "workspace_id": folder.workspace_id,
                "name": folder.name,
                "parent_id": folder.parent_id,
                "document_count": count,
            })
        return folders_data

    async def update(self, folder: Folder, **kwargs) -> Folder:
        for key, value in kwargs.items():
            if value is not None:
                setattr(folder, key, value)
        await self.db.commit()
        await self.db.refresh(folder)
        return folder

    async def delete(self, folder: Folder) -> None:
        await self.db.delete(folder)
        await self.db.commit()
