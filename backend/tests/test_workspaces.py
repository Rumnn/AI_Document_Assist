"""Integration and endpoint tests for Workspaces CRUD and Member Management."""
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from datetime import datetime, timezone

from app.main import create_application
from app.models.models import User, Workspace, WorkspaceMember, WorkspaceRole
from app.api.v1.deps import get_current_user, get_db


@pytest.fixture
def app():
    return create_application()


@pytest.mark.asyncio
async def test_create_workspace_endpoint(app, mock_owner):
    """POST /api/v1/workspaces successfully creates a workspace."""
    ws_id = uuid.uuid4()
    mock_ws = Workspace(
        id=ws_id,
        name="Engineering Lab",
        owner_id=mock_owner.id,
        created_at=datetime.now(timezone.utc),
    )

    mock_db = AsyncMock()

    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.create = AsyncMock(return_value=mock_ws)
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/workspaces",
                json={"name": "Engineering Lab"},
            )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Engineering Lab"
        assert data["current_user_role"] == "owner"
        assert data["member_count"] == 1


@pytest.mark.asyncio
async def test_list_workspaces_endpoint(app, mock_owner):
    """GET /api/v1/workspaces lists workspaces for current user."""
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    workspaces_data = [
        {
            "id": uuid.uuid4(),
            "name": "Acme Corp Labs",
            "owner_id": mock_owner.id,
            "created_at": "2026-01-01T00:00:00Z",
            "member_count": 14,
            "current_user_role": "owner",
        }
    ]

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.list_for_user = AsyncMock(return_value=workspaces_data)
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/workspaces")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Acme Corp Labs"
        assert data[0]["member_count"] == 14


@pytest.mark.asyncio
async def test_add_member_duplicate_conflict(app, mock_owner):
    """Adding an existing member raises 409 Conflict."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    existing_user = User(
        id=uuid.uuid4(),
        email="bob@acme.io",
        full_name="Bob",
        password_hash="mock",
    )
    existing_membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=existing_user.id,
        role=WorkspaceRole.member,
    )
    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=mock_owner.id)
    caller_membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.owner,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_user_repo = MagicMock()
        mock_user_repo.get_by_email = AsyncMock(return_value=existing_user)
        mp.setattr("app.api.v1.routers.workspaces.UserRepository", lambda db: mock_user_repo)

        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_ws_repo.get_member = AsyncMock(side_effect=[caller_membership, existing_membership])
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_ws_repo)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                f"/api/v1/workspaces/{ws_id}/members",
                json={"email": "bob@acme.io", "role": "member"},
            )

        assert response.status_code == 409
        assert "already a member" in response.json()["detail"]


@pytest.mark.asyncio
async def test_cannot_remove_workspace_owner(app, mock_owner):
    """Attempting to remove the owner raises 400 Bad Request."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=mock_owner.id)
    owner_membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.owner,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_ws_repo.get_member = AsyncMock(return_value=owner_membership)
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_ws_repo)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.delete(
                f"/api/v1/workspaces/{ws_id}/members/{mock_owner.id}"
            )

        assert response.status_code == 400
        assert "Cannot remove the workspace owner" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_workspace_details_endpoint(app, mock_owner):
    """GET /api/v1/workspaces/{id} returns workspace detail with member roster."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    mock_ws = Workspace(
        id=ws_id,
        name="Security Guild",
        owner_id=mock_owner.id,
        created_at=datetime.now(timezone.utc),
    )
    membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.owner,
    )
    members_data = [
        {
            "id": membership.id,
            "workspace_id": ws_id,
            "user_id": mock_owner.id,
            "email": mock_owner.email,
            "full_name": mock_owner.full_name,
            "avatar_url": None,
            "role": WorkspaceRole.owner,
        }
    ]

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mock_ws_repo.list_members = AsyncMock(return_value=members_data)
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_ws_repo)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get(f"/api/v1/workspaces/{ws_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Security Guild"
        assert len(data["members"]) == 1
        assert data["members"][0]["email"] == mock_owner.email


@pytest.mark.asyncio
async def test_update_workspace_name_endpoint(app, mock_owner):
    """PATCH /api/v1/workspaces/{id} renames workspace."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    mock_ws = Workspace(
        id=ws_id,
        name="Old Name",
        owner_id=mock_owner.id,
        created_at=datetime.now(timezone.utc),
    )
    updated_ws = Workspace(
        id=ws_id,
        name="Renamed Guild",
        owner_id=mock_owner.id,
        created_at=datetime.now(timezone.utc),
    )
    membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.owner,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mock_ws_repo.update = AsyncMock(return_value=updated_ws)
        mock_ws_repo.list_members = AsyncMock(return_value=[])
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_ws_repo)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.patch(
                f"/api/v1/workspaces/{ws_id}",
                json={"name": "Renamed Guild"},
            )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Renamed Guild"


@pytest.mark.asyncio
async def test_delete_workspace_endpoint(app, mock_owner):
    """DELETE /api/v1/workspaces/{id} permanently deletes workspace (Owner only)."""
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    mock_ws = Workspace(id=ws_id, name="Test WS", owner_id=mock_owner.id)
    membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.owner,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=mock_ws)
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mock_ws_repo.delete = AsyncMock(return_value=None)
        mp.setattr("app.api.v1.routers.workspaces.WorkspaceRepository", lambda db: mock_ws_repo)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.delete(f"/api/v1/workspaces/{ws_id}")

        assert response.status_code == 204

