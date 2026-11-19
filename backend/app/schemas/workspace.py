"""Pydantic schemas for workspaces and memberships."""
import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator

from app.models.models import WorkspaceRole


class WorkspaceCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Workspace name cannot be empty")
        if len(v) > 255:
            raise ValueError("Workspace name cannot exceed 255 characters")
        return v


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Workspace name cannot be empty")
            if len(v) > 255:
                raise ValueError("Workspace name cannot exceed 255 characters")
        return v


class WorkspaceMemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    user_id: uuid.UUID
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    role: WorkspaceRole


class WorkspaceMemberAdd(BaseModel):
    email: str
    role: WorkspaceRole = WorkspaceRole.member

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.strip().lower()


class WorkspaceMemberUpdateRole(BaseModel):
    role: WorkspaceRole


class WorkspaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    owner_id: uuid.UUID
    created_at: Optional[datetime] = None
    member_count: int = 1
    current_user_role: Optional[WorkspaceRole] = None


class WorkspaceDetailResponse(WorkspaceResponse):
    members: List[WorkspaceMemberResponse] = []
