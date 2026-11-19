"""Document repository – database operations for Document model."""
import uuid
from typing import Optional, List, Tuple
from sqlalchemy import select, func, or_, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Document, DocumentStatus


class DocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        workspace_id: uuid.UUID,
        uploaded_by: uuid.UUID,
        name: str,
        file_type: str,
        mime_type: str,
        file_size: int,
        storage_key: str,
        checksum: Optional[str] = None,
        folder_id: Optional[uuid.UUID] = None,
        status: DocumentStatus = DocumentStatus.uploaded,
    ) -> Document:
        doc = Document(
            workspace_id=workspace_id,
            uploaded_by=uploaded_by,
            name=name,
            file_type=file_type,
            mime_type=mime_type,
            file_size=file_size,
            storage_key=storage_key,
            checksum=checksum,
            folder_id=folder_id,
            status=status,
        )
        self.db.add(doc)
        await self.db.commit()
        await self.db.refresh(doc)
        return doc

    async def get_by_id(self, document_id: uuid.UUID) -> Optional[Document]:
        result = await self.db.execute(
            select(Document).where(Document.id == document_id)
        )
        return result.scalar_one_or_none()

    async def list_for_workspace(
        self,
        workspace_id: uuid.UUID,
        folder_id: Optional[uuid.UUID] = None,
        status: Optional[DocumentStatus] = None,
        q: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Document], int]:
        query = select(Document).where(Document.workspace_id == workspace_id)
        count_query = select(func.count(Document.id)).where(Document.workspace_id == workspace_id)

        if folder_id is not None:
            query = query.where(Document.folder_id == folder_id)
            count_query = count_query.where(Document.folder_id == folder_id)

        if status is not None:
            query = query.where(Document.status == status)
            count_query = count_query.where(Document.status == status)

        if q:
            search_pattern = f"%{q.strip()}%"
            query = query.where(Document.name.ilike(search_pattern))
            count_query = count_query.where(Document.name.ilike(search_pattern))

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        query = query.order_by(Document.created_at.desc()).limit(limit).offset(offset)
        result = await self.db.execute(query)
        documents = list(result.scalars().all())

        return documents, total

    async def update(self, document: Document, **kwargs) -> Document:
        for key, value in kwargs.items():
            if value is not None:
                setattr(document, key, value)
        await self.db.commit()
        await self.db.refresh(document)
        return document

    async def delete(self, document: Document) -> None:
        await self.db.delete(document)
        await self.db.commit()
