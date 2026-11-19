"""Pydantic schemas for documents."""
import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator

from app.models.models import DocumentStatus


class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    folder_id: Optional[uuid.UUID] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Document name cannot be empty")
            if len(v) > 512:
                raise ValueError("Document name cannot exceed 512 characters")
        return v


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    folder_id: Optional[uuid.UUID] = None
    uploaded_by: Optional[uuid.UUID] = None
    name: str
    file_type: str
    mime_type: str
    file_size: int
    status: DocumentStatus
    page_count: Optional[int] = None
    chunk_count: Optional[int] = None
    error_message: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class DocumentListResponse(BaseModel):
    total: int
    items: List[DocumentResponse]


class DocumentDownloadResponse(BaseModel):
    download_url: str
    filename: str
    file_size: int
