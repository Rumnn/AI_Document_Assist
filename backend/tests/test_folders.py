"""Integration and endpoint tests for Folders router."""
import uuid
from datetime import datetime, timezone
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import create_application
from app.models.models import User, Folder, WorkspaceMember, WorkspaceRole
from app.api.v1.deps import get_current_user, get_db


@pytest.fixture
def app():
    return create_application()


@pytest.mark.asyncio
async def test_create_folder_success(app, mock_owner):
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    created_folder = Folder(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        name="Financial Reports",
        parent_id=None,
    )
    membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.owner,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=MagicMock())
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        mock_folder_repo = MagicMock()
        mock_folder_repo.create = AsyncMock(return_value=created_folder)
        mp.setattr("app.api.v1.routers.folders.FolderRepository", lambda db: mock_folder_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/folders",
                json={"name": "Financial Reports", "workspace_id": str(ws_id)},
            )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Financial Reports"
        assert data["workspace_id"] == str(ws_id)


@pytest.mark.asyncio
async def test_list_folders_endpoint(app, mock_owner):
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    membership = WorkspaceMember(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        user_id=mock_owner.id,
        role=WorkspaceRole.viewer,
    )
    folders_data = [
        {
            "id": uuid.uuid4(),
            "workspace_id": ws_id,
            "name": "Legal",
            "parent_id": None,
            "document_count": 5,
        }
    ]

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=MagicMock())
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        mock_folder_repo = MagicMock()
        mock_folder_repo.list_by_workspace = AsyncMock(return_value=folders_data)
        mp.setattr("app.api.v1.routers.folders.FolderRepository", lambda db: mock_folder_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get(f"/api/v1/folders?workspace_id={ws_id}")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Legal"
        assert data[0]["document_count"] == 5


@pytest.mark.asyncio
async def test_folder_cannot_be_own_parent(app, mock_owner):
    folder_id = uuid.uuid4()
    ws_id = uuid.uuid4()
    mock_db = AsyncMock()
    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    folder = Folder(id=folder_id, workspace_id=ws_id, name="Test Folder", parent_id=None)
    membership = WorkspaceMember(
        id=uuid.uuid4(), workspace_id=ws_id, user_id=mock_owner.id, role=WorkspaceRole.owner
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=MagicMock())
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        mock_folder_repo = MagicMock()
        mock_folder_repo.get_by_id = AsyncMock(return_value=folder)
        mp.setattr("app.api.v1.routers.folders.FolderRepository", lambda db: mock_folder_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.patch(
                f"/api/v1/folders/{folder_id}",
                json={"parent_id": str(folder_id)},
            )

        assert response.status_code == 400
        assert "cannot be its own parent" in response.json()["detail"].lower()
