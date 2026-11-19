"""File validation service – checks size, extension, MIME type, and magic bytes."""
import hashlib
from typing import Tuple
from fastapi import HTTPException, status
from app.core.config import settings

MIME_TYPE_MAP = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "txt": "text/plain",
}

MAGIC_SIGNATURES = {
    "pdf": b"%PDF-",
    "docx": b"PK\x03\x04",  # ZIP container header
}


class FileValidator:
    @staticmethod
    def validate(
        filename: str, content: bytes, reported_mime: str = ""
    ) -> Tuple[str, str, str]:
        """
        Validate uploaded file contents.
        Returns:
            Tuple of (file_type, canonical_mime_type, sha256_checksum)
        Raises:
            HTTPException on validation error.
        """
        # 1. Size Check
        size_bytes = len(content)
        if size_bytes == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty (0 bytes).",
            )
        if size_bytes > settings.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    f"File size ({size_bytes / (1024 * 1024):.1f} MB) exceeds maximum "
                    f"allowed limit of {settings.MAX_FILE_SIZE_MB} MB."
                ),
            )

        # 2. Extension Check
        if "." not in filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File has no extension.",
            )
        ext = filename.rsplit(".", 1)[-1].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            allowed = ", ".join(settings.ALLOWED_EXTENSIONS)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension '.{ext}' is not supported. Allowed formats: {allowed}.",
            )

        # 3. Magic Bytes / Content Inspection
        if ext in MAGIC_SIGNATURES:
            sig = MAGIC_SIGNATURES[ext]
            if not content.startswith(sig):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid file content for '.{ext}' format (signature mismatch).",
                )
        elif ext == "txt":
            # Verify plain text is decodable
            try:
                content.decode("utf-8")
            except UnicodeDecodeError:
                try:
                    content.decode("latin-1")
                except Exception:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Text file must be valid UTF-8 or Latin-1 encoded text.",
                    )

        # 4. Canonical MIME type
        canonical_mime = MIME_TYPE_MAP.get(ext, reported_mime or "application/octet-stream")

        # 5. Checksum (SHA-256)
        checksum = hashlib.sha256(content).hexdigest()

        return ext, canonical_mime, checksum


file_validator = FileValidator()
