"""
MinIO (S3-compatible) object storage integration.
Handles bucket initialization, file upload, download, and deletion.
"""
import io
import uuid
import structlog
from typing import Optional
from minio import Minio
from minio.error import S3Error

from app.core.config import settings

logger = structlog.get_logger(__name__)


def get_minio_client() -> Minio:
    """Create a MinIO client from application settings."""
    return Minio(
        endpoint=settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_ROOT_USER,
        secret_key=settings.MINIO_ROOT_PASSWORD,
        secure=settings.MINIO_SECURE,
    )


def ensure_bucket(client: Optional[Minio] = None) -> None:
    """Create the default bucket if it doesn't exist."""
    client = client or get_minio_client()
    bucket = settings.MINIO_BUCKET_NAME
    try:
        if not client.bucket_exists(bucket):
            client.make_bucket(bucket)
            logger.info("Created MinIO bucket", bucket=bucket)
        else:
            logger.debug("MinIO bucket already exists", bucket=bucket)
    except S3Error as e:
        logger.error("Failed to ensure MinIO bucket", bucket=bucket, error=str(e))
        raise


def generate_storage_key(workspace_id: uuid.UUID, filename: str) -> str:
    """
    Generate a unique storage key to avoid collisions.
    Format: {workspace_id}/{uuid4}_{original_filename}
    """
    unique_id = uuid.uuid4().hex[:12]
    safe_name = filename.replace(" ", "_")
    return f"{workspace_id}/{unique_id}_{safe_name}"


def upload_file(
    data: bytes,
    storage_key: str,
    content_type: str,
    client: Optional[Minio] = None,
) -> str:
    """
    Upload a file to MinIO. Returns the storage_key on success.
    """
    client = client or get_minio_client()
    bucket = settings.MINIO_BUCKET_NAME
    try:
        client.put_object(
            bucket_name=bucket,
            object_name=storage_key,
            data=io.BytesIO(data),
            length=len(data),
            content_type=content_type,
        )
        logger.info(
            "Uploaded file to MinIO",
            bucket=bucket,
            key=storage_key,
            size=len(data),
        )
        return storage_key
    except S3Error as e:
        logger.error("MinIO upload failed", key=storage_key, error=str(e))
        raise


def download_file(
    storage_key: str,
    client: Optional[Minio] = None,
) -> bytes:
    """Download a file from MinIO and return its bytes."""
    client = client or get_minio_client()
    bucket = settings.MINIO_BUCKET_NAME
    try:
        response = client.get_object(bucket_name=bucket, object_name=storage_key)
        data = response.read()
        response.close()
        response.release_conn()
        logger.info("Downloaded file from MinIO", key=storage_key, size=len(data))
        return data
    except S3Error as e:
        logger.error("MinIO download failed", key=storage_key, error=str(e))
        raise


def delete_file(
    storage_key: str,
    client: Optional[Minio] = None,
) -> None:
    """Delete a file from MinIO."""
    client = client or get_minio_client()
    bucket = settings.MINIO_BUCKET_NAME
    try:
        client.remove_object(bucket_name=bucket, object_name=storage_key)
        logger.info("Deleted file from MinIO", key=storage_key)
    except S3Error as e:
        logger.error("MinIO delete failed", key=storage_key, error=str(e))
        raise


def get_presigned_url(
    storage_key: str,
    expires_hours: int = 1,
    client: Optional[Minio] = None,
) -> str:
    """Generate a presigned download URL."""
    from datetime import timedelta
    client = client or get_minio_client()
    bucket = settings.MINIO_BUCKET_NAME
    try:
        url = client.presigned_get_object(
            bucket_name=bucket,
            object_name=storage_key,
            expires=timedelta(hours=expires_hours),
        )
        return url
    except S3Error as e:
        logger.error("MinIO presigned URL failed", key=storage_key, error=str(e))
        raise
