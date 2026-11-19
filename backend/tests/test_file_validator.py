"""Unit tests for FileValidator service."""
import pytest
from fastapi import HTTPException
from app.services.file_validator import file_validator
from app.core.config import settings


def test_validate_valid_pdf():
    content = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
    ext, mime, checksum = file_validator.validate("report.pdf", content, "application/pdf")
    assert ext == "pdf"
    assert mime == "application/pdf"
    assert len(checksum) == 64


def test_validate_valid_docx():
    content = b"PK\x03\x04\x14\x00\x06\x00\x08\x00mock docx content"
    ext, mime, checksum = file_validator.validate("notes.docx", content)
    assert ext == "docx"
    assert "wordprocessingml.document" in mime
    assert len(checksum) == 64


def test_validate_valid_txt():
    content = "Hello, world! This is a test document.".encode("utf-8")
    ext, mime, checksum = file_validator.validate("readme.txt", content)
    assert ext == "txt"
    assert mime == "text/plain"
    assert len(checksum) == 64


def test_validate_empty_file_rejected():
    with pytest.raises(HTTPException) as exc:
        file_validator.validate("empty.pdf", b"")
    assert exc.value.status_code == 400
    assert "empty" in exc.value.detail.lower()


def test_validate_unsupported_extension_rejected():
    with pytest.raises(HTTPException) as exc:
        file_validator.validate("script.exe", b"MZ\x90\x00")
    assert exc.value.status_code == 400
    assert "not supported" in exc.value.detail.lower()


def test_validate_signature_mismatch_rejected():
    # File named .pdf but containing plain text without %PDF-
    with pytest.raises(HTTPException) as exc:
        file_validator.validate("fake.pdf", b"this is not a pdf file")
    assert exc.value.status_code == 400
    assert "signature mismatch" in exc.value.detail.lower()


def test_validate_oversized_file_rejected():
    # 51 MB content
    large_size = (settings.MAX_FILE_SIZE_MB + 1) * 1024 * 1024
    # Mocking content length via a dummy bytes-like object or slice check
    with pytest.MonkeyPatch.context() as mp:
        mp.setattr(settings, "MAX_FILE_SIZE_MB", 1)  # Temporarily set max to 1 MB
        content = b"%PDF-" + b"0" * (2 * 1024 * 1024)
        with pytest.raises(HTTPException) as exc:
            file_validator.validate("large.pdf", content)
        assert exc.value.status_code == 413
        assert "exceeds maximum allowed limit" in exc.value.detail.lower()
