"""Integration and endpoint tests for Documents router."""
import io
import uuid
from datetime import datetime, timezone
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import create_application
from app.models.models import User, Document, DocumentStatus, WorkspaceMember, WorkspaceRole
from app.api.v1.deps import get_current_user, get_db


@pytest.fixture
def app():
    return create_application()


@pytest.mark.asyncio
async def test_upload_document_success(app, mock_owner):
    """POST /api/v1/documents/upload validates and uploads file to storage and DB."""
    ws_id = uuid.uuid4()
    doc_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    mock_db = AsyncMock()

    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    membership = WorkspaceMember(
        id=uuid.uuid4(), workspace_id=ws_id, user_id=mock_owner.id, role=WorkspaceRole.owner
    )
    created_doc = Document(
        id=doc_id,
        workspace_id=ws_id,
        uploaded_by=mock_owner.id,
        name="contract.pdf",
        file_type="pdf",
        mime_type="application/pdf",
        file_size=100,
        storage_key=f"{ws_id}/{doc_id}/contract.pdf",
        checksum="mock_checksum",
        status=DocumentStatus.queued,
        created_at=now,
        updated_at=now,
    )

    pdf_content = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=MagicMock())
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        mock_storage = MagicMock()
        mock_storage.upload_file = MagicMock(return_value="mock_key")
        mp.setattr("app.api.v1.routers.documents.storage_service", mock_storage)

        mock_doc_repo = MagicMock()
        mock_doc_repo.create = AsyncMock(return_value=created_doc)
        mp.setattr("app.api.v1.routers.documents.DocumentRepository", lambda db: mock_doc_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            files = {
                "file": ("contract.pdf", pdf_content, "application/pdf")
            }
            data = {
                "workspace_id": str(ws_id)
            }
            response = await client.post(
                "/api/v1/documents/upload",
                files=files,
                data=data,
            )

        assert response.status_code == 201
        res = response.json()
        assert res["name"] == "contract.pdf"
        assert res["file_type"] == "pdf"
        assert res["status"] == "queued"


@pytest.mark.asyncio
async def test_list_documents_endpoint(app, mock_owner):
    """GET /api/v1/documents returns list and count."""
    ws_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    mock_db = AsyncMock()

    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    membership = WorkspaceMember(
        id=uuid.uuid4(), workspace_id=ws_id, user_id=mock_owner.id, role=WorkspaceRole.viewer
    )
    doc_item = Document(
        id=uuid.uuid4(),
        workspace_id=ws_id,
        uploaded_by=mock_owner.id,
        name="specs.txt",
        file_type="txt",
        mime_type="text/plain",
        file_size=50,
        storage_key="test_key",
        status=DocumentStatus.completed,
        created_at=now,
        updated_at=now,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=MagicMock())
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        mock_doc_repo = MagicMock()
        mock_doc_repo.list_for_workspace = AsyncMock(return_value=([doc_item], 1))
        mp.setattr("app.api.v1.routers.documents.DocumentRepository", lambda db: mock_doc_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get(f"/api/v1/documents?workspace_id={ws_id}")

        assert response.status_code == 200
        res = response.json()
        assert res["total"] == 1
        assert len(res["items"]) == 1
        assert res["items"][0]["name"] == "specs.txt"


@pytest.mark.asyncio
async def test_get_document_download_url(app, mock_owner):
    """GET /api/v1/documents/{id}/download generates secure presigned link."""
    ws_id = uuid.uuid4()
    doc_id = uuid.uuid4()
    mock_db = AsyncMock()

    app.dependency_overrides[get_current_user] = lambda: mock_owner
    app.dependency_overrides[get_db] = lambda: mock_db

    membership = WorkspaceMember(
        id=uuid.uuid4(), workspace_id=ws_id, user_id=mock_owner.id, role=WorkspaceRole.viewer
    )
    doc = Document(
        id=doc_id,
        workspace_id=ws_id,
        uploaded_by=mock_owner.id,
        name="dataset.pdf",
        file_type="pdf",
        mime_type="application/pdf",
        file_size=2048,
        storage_key=f"{ws_id}/{doc_id}/dataset.pdf",
        status=DocumentStatus.completed,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_ws_repo = MagicMock()
        mock_ws_repo.get_by_id = AsyncMock(return_value=MagicMock())
        mock_ws_repo.get_member = AsyncMock(return_value=membership)
        mp.setattr("app.api.v1.deps.WorkspaceRepository", lambda db: mock_ws_repo)

        mock_doc_repo = MagicMock()
        mock_doc_repo.get_by_id = AsyncMock(return_value=doc)
        mp.setattr("app.api.v1.routers.documents.DocumentRepository", lambda db: mock_doc_repo)

        mock_storage = MagicMock()
        mock_storage.get_presigned_download_url = MagicMock(
            return_value="https://minio.local/ai-documents/presigned_url"
        )
        mp.setattr("app.api.v1.routers.documents.storage_service", mock_storage)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get(f"/api/v1/documents/{doc_id}/download")

        assert response.status_code == 200
        res = response.json()
        assert "presigned_url" in res["download_url"]
        assert res["filename"] == "dataset.pdf"
        assert res["file_size"] == 2048
