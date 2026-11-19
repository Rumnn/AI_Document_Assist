"""
Documents router – upload, validation, storage, CRUD, and retrieval.
"""
import uuid
from typing import Optional
import structlog
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, require_workspace_role
from app.db.session import get_db
from app.models.models import User, DocumentStatus, WorkspaceRole
from app.repositories.document_repository import DocumentRepository
from app.repositories.folder_repository import FolderRepository
from app.schemas.document import (
    DocumentResponse,
    DocumentListResponse,
    DocumentUpdate,
    DocumentDownloadResponse,
)
from app.services.file_validator import file_validator
from app.services.storage_service import storage_service

logger = structlog.get_logger(__name__)

router = APIRouter()


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload document",
)
async def upload_document(
    workspace_id: uuid.UUID = Form(...),
    folder_id: Optional[uuid.UUID] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Multipart upload document:
    1. Enforces workspace RBAC (Member role or higher).
    2. Validates file extension, MIME, magic bytes, and size.
    3. Uploads binary to MinIO object storage.
    4. Creates Document database record.
    5. Dispatches background parsing & indexing Celery worker.
    """
    # 1. RBAC check
    check_role = require_workspace_role(WorkspaceRole.member)
    await check_role(workspace_id=workspace_id, current_user=current_user, db=db)

    # 2. Check folder belongs to workspace if provided
    if folder_id:
        folder_repo = FolderRepository(db)
        folder = await folder_repo.get_by_id(folder_id)
        if not folder or folder.workspace_id != workspace_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found in this workspace.",
            )

    # 3. Read and Validate file
    content = await file.read()
    file_type, canonical_mime, checksum = file_validator.validate(
        filename=file.filename or "unnamed",
        content=content,
        reported_mime=file.content_type or "",
    )

    doc_id = uuid.uuid4()
    storage_key = f"{workspace_id}/{doc_id}/{file.filename}"

    # 4. Upload to MinIO
    try:
        storage_service.upload_file(
            file_data=content,
            object_name=storage_key,
            content_type=canonical_mime,
        )
    except Exception as e:
        logger.error("MinIO upload failed", error=str(e), storage_key=storage_key)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to store document in object storage.",
        )

    # 5. Save database record
    doc_repo = DocumentRepository(db)
    doc = await doc_repo.create(
        workspace_id=workspace_id,
        uploaded_by=current_user.id,
        name=file.filename or "unnamed",
        file_type=file_type,
        mime_type=canonical_mime,
        file_size=len(content),
        storage_key=storage_key,
        checksum=checksum,
        folder_id=folder_id,
        status=DocumentStatus.queued,
    )

    # 6. Trigger background task
    try:
        from app.workers.tasks import process_document
        process_document.delay(str(doc.id))
    except Exception as e:
        logger.warning("Could not dispatch Celery task immediately", error=str(e), doc_id=str(doc.id))

    return doc


@router.get(
    "",
    response_model=DocumentListResponse,
    summary="List documents",
)
async def list_documents(
    workspace_id: uuid.UUID = Query(..., description="Target workspace ID"),
    folder_id: Optional[uuid.UUID] = Query(None, description="Filter by folder ID"),
    status: Optional[DocumentStatus] = Query(None, description="Filter by processing status"),
    q: Optional[str] = Query(None, description="Search keyword in filename"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents in a workspace with optional folder/status/keyword filtering."""
    check_role = require_workspace_role(WorkspaceRole.viewer)
    await check_role(workspace_id=workspace_id, current_user=current_user, db=db)

    doc_repo = DocumentRepository(db)
    docs, total = await doc_repo.list_for_workspace(
        workspace_id=workspace_id,
        folder_id=folder_id,
        status=status,
        q=q,
        limit=limit,
        offset=offset,
    )

    return DocumentListResponse(
        total=total,
        items=[DocumentResponse.model_validate(d) for d in docs],
    )


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Get document details",
)
async def get_document(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve document metadata and processing status."""
    doc_repo = DocumentRepository(db)
    doc = await doc_repo.get_by_id(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    check_role = require_workspace_role(WorkspaceRole.viewer)
    await check_role(workspace_id=doc.workspace_id, current_user=current_user, db=db)

    return DocumentResponse.model_validate(doc)


@router.patch(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Update document",
)
async def update_document(
    document_id: uuid.UUID,
    payload: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Rename document or move it to a different folder."""
    doc_repo = DocumentRepository(db)
    doc = await doc_repo.get_by_id(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    check_role = require_workspace_role(WorkspaceRole.member)
    await check_role(workspace_id=doc.workspace_id, current_user=current_user, db=db)

    if payload.folder_id:
        folder_repo = FolderRepository(db)
        target_folder = await folder_repo.get_by_id(payload.folder_id)
        if not target_folder or target_folder.workspace_id != doc.workspace_id:
            raise HTTPException(
                status_code=404, detail="Destination folder not found in this workspace."
            )

    updated = await doc_repo.update(doc, name=payload.name, folder_id=payload.folder_id)
    return DocumentResponse.model_validate(updated)


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete document",
)
async def delete_document(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete document from database and MinIO object storage."""
    doc_repo = DocumentRepository(db)
    doc = await doc_repo.get_by_id(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Allow if caller is uploader OR admin/owner
    check_role = require_workspace_role(WorkspaceRole.member)
    membership = await check_role(workspace_id=doc.workspace_id, current_user=current_user, db=db)

    if doc.uploaded_by != current_user.id and membership.role not in [
        WorkspaceRole.owner,
        WorkspaceRole.admin,
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only document uploader or workspace admins can delete this document.",
        )

    # Remove binary from MinIO
    try:
        storage_service.delete_file(doc.storage_key)
    except Exception as e:
        logger.warning("Could not delete file from MinIO", error=str(e), storage_key=doc.storage_key)

    await doc_repo.delete(doc)
    return None


@router.get(
    "/{document_id}/download",
    response_model=DocumentDownloadResponse,
    summary="Get presigned download URL",
)
async def get_download_url(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a secure presigned URL to download or preview the document."""
    doc_repo = DocumentRepository(db)
    doc = await doc_repo.get_by_id(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    check_role = require_workspace_role(WorkspaceRole.viewer)
    await check_role(workspace_id=doc.workspace_id, current_user=current_user, db=db)

    url = storage_service.get_presigned_download_url(doc.storage_key)
    return DocumentDownloadResponse(
        download_url=url,
        filename=doc.name,
        file_size=doc.file_size,
    )
