"""Unit tests for Workspace RBAC logic and permission hierarchies."""
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException

from app.models.models import User, Workspace, WorkspaceMember, WorkspaceRole
from app.api.v1.deps import require_workspace_role, ROLE_HIERARCHY


def test_role_hierarchy_ordering():
    """Verify that role hierarchy strictly respects owner > admin > member > viewer."""
    assert ROLE_HIERARCHY[WorkspaceRole.owner] > ROLE_HIERARCHY[WorkspaceRole.admin]
    assert ROLE_HIERARCHY[WorkspaceRole.admin] > ROLE_HIERARCHY[WorkspaceRole.member]
    assert ROLE_HIERARCHY[WorkspaceRole.member] > ROLE_HIERARCHY[WorkspaceRole.viewer]


@pytest.mark.asyncio
async def test_require_workspace_role_success(mock_owner):
    """Owner satisfies min_role=admin."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()

    # Create mock workspace and membership
    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=mock_owner.id)
    mock_membership = WorkspaceMember(
        id=uuid.uuid4(), workspace_id=ws_id, user_id=mock_owner.id, role=WorkspaceRole.owner
    )

    dep_fn = require_workspace_role(WorkspaceRole.admin)

    # Patch WorkspaceRepository inside dependency
    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_repo.get_member = AsyncMock(return_value=mock_membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_repo)

        result = await dep_fn(workspace_id=ws_id, current_user=mock_owner, db=mock_db)
        assert result.role == WorkspaceRole.owner
        assert result.workspace_id == ws_id


@pytest.mark.asyncio
async def test_require_workspace_role_forbidden_low_role(mock_viewer):
    """Viewer attempting an admin action gets 403 Forbidden."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()

    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=uuid.uuid4())
    mock_membership = WorkspaceMember(
        id=uuid.uuid4(), workspace_id=ws_id, user_id=mock_viewer.id, role=WorkspaceRole.viewer
    )

    dep_fn = require_workspace_role(WorkspaceRole.admin)

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_repo.get_member = AsyncMock(return_value=mock_membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_repo)

        with pytest.raises(HTTPException) as exc_info:
            await dep_fn(workspace_id=ws_id, current_user=mock_viewer, db=mock_db)
        assert exc_info.value.status_code == 403
        assert "requires 'admin' role or higher" in exc_info.value.detail


@pytest.mark.asyncio
async def test_require_workspace_role_workspace_not_found(mock_owner):
    """Non-existent workspace raises 404 Not Found."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()

    dep_fn = require_workspace_role(WorkspaceRole.viewer)

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_id = AsyncMock(return_value=None)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_repo)

        with pytest.raises(HTTPException) as exc_info:
            await dep_fn(workspace_id=ws_id, current_user=mock_owner, db=mock_db)
        assert exc_info.value.status_code == 404
        assert "Workspace not found" in exc_info.value.detail


@pytest.mark.asyncio
async def test_require_workspace_role_not_a_member(mock_member):
    """User not in workspace gets 403 Forbidden."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()

    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=uuid.uuid4())

    dep_fn = require_workspace_role(WorkspaceRole.viewer)

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_repo.get_member = AsyncMock(return_value=None)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_repo)

        with pytest.raises(HTTPException) as exc_info:
            await dep_fn(workspace_id=ws_id, current_user=mock_member, db=mock_db)
        assert exc_info.value.status_code == 403
        assert "not a member" in exc_info.value.detail


@pytest.mark.asyncio
async def test_require_workspace_role_superuser_bypass():
    """Superuser bypasses membership and receives owner privileges."""
    superuser = User(
        id=uuid.uuid4(),
        email="root@acme.io",
        password_hash="mock",
        full_name="Root Admin",
        is_active=True,
        is_superuser=True,
    )
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()

    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=uuid.uuid4())

    dep_fn = require_workspace_role(WorkspaceRole.owner)

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_repo.get_member = AsyncMock(return_value=None)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_repo)

        result = await dep_fn(workspace_id=ws_id, current_user=superuser, db=mock_db)
        assert result.role == WorkspaceRole.owner
