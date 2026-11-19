"""Pydantic schemas for folders."""
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator


class FolderCreate(BaseModel):
    name: str
    workspace_id: uuid.UUID
    parent_id: Optional[uuid.UUID] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Folder name cannot be empty")
        if len(v) > 255:
            raise ValueError("Folder name cannot exceed 255 characters")
        return v


class FolderUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[uuid.UUID] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Folder name cannot be empty")
            if len(v) > 255:
                raise ValueError("Folder name cannot exceed 255 characters")
        return v


class FolderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    name: str
    parent_id: Optional[uuid.UUID] = None
    document_count: int = 0
