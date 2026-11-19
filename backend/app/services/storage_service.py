"""MinIO / S3 object storage service."""
import io
from typing import BinaryIO, Optional
import structlog
from minio import Minio
from minio.error import S3Error

from app.core.config import settings

logger = structlog.get_logger(__name__)


class StorageService:
    def __init__(self):
        self.endpoint = settings.MINIO_ENDPOINT
        self.access_key = settings.MINIO_ROOT_USER
        self.secret_key = settings.MINIO_ROOT_PASSWORD
        self.secure = settings.MINIO_SECURE
        self.bucket = settings.MINIO_BUCKET_NAME

        self._client: Optional[Minio] = None

    @property
    def client(self) -> Minio:
        if self._client is None:
            self._client = Minio(
                endpoint=self.endpoint,
                access_key=self.access_key,
                secret_key=self.secret_key,
                secure=self.secure,
            )
        return self._client

    def ensure_bucket_exists(self) -> None:
        """Create target storage bucket if it does not already exist."""
        try:
            if not self.client.bucket_exists(self.bucket):
                self.client.make_bucket(self.bucket)
                logger.info("Created MinIO bucket", bucket=self.bucket)
        except Exception as e:
            logger.error("Failed to ensure MinIO bucket", bucket=self.bucket, error=str(e))
            raise

    def upload_file(
        self,
        file_data: bytes | BinaryIO,
        object_name: str,
        content_type: str = "application/octet-stream",
        length: int = -1,
    ) -> str:
        """
        Upload binary file or stream to MinIO.
        Returns the object_name / storage key.
        """
        self.ensure_bucket_exists()

        if isinstance(file_data, bytes):
            stream = io.BytesIO(file_data)
            part_size = 10 * 1024 * 1024
            length = len(file_data)
        else:
            stream = file_data
            part_size = 10 * 1024 * 1024

        self.client.put_object(
            bucket_name=self.bucket,
            object_name=object_name,
            data=stream,
            length=length,
            part_size=part_size if length == -1 else 0,
            content_type=content_type,
        )
        logger.info("Uploaded object to MinIO", object_name=object_name, size=length)
        return object_name

    def download_file(self, object_name: str) -> bytes:
        """Download object content as bytes."""
        try:
            response = self.client.get_object(self.bucket, object_name)
            data = response.read()
            response.close()
            response.release_conn()
            return data
        except S3Error as e:
            logger.error("Failed to download object", object_name=object_name, error=str(e))
            raise

    def delete_file(self, object_name: str) -> None:
        """Delete an object from MinIO."""
        try:
            self.client.remove_object(self.bucket, object_name)
            logger.info("Deleted object from MinIO", object_name=object_name)
        except S3Error as e:
            logger.error("Failed to delete object", object_name=object_name, error=str(e))
            raise

    def get_presigned_download_url(
        self, object_name: str, expires_seconds: int = 3600
    ) -> str:
        """Generate a presigned GET URL for downloading the file."""
        from datetime import timedelta
        try:
            return self.client.presigned_get_object(
                bucket_name=self.bucket,
                object_name=object_name,
                expires=timedelta(seconds=expires_seconds),
            )
        except S3Error as e:
            logger.error("Failed to generate presigned URL", object_name=object_name, error=str(e))
            raise


storage_service = StorageService()
