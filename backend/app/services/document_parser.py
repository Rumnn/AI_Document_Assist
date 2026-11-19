"""
Document text extraction – PDF, DOCX, and TXT parsers.
Each parser returns structured page-level content for downstream chunking.
"""
import io
import structlog
from dataclasses import dataclass, field
from typing import List, Optional

logger = structlog.get_logger(__name__)


@dataclass
class ParsedPage:
    """A single page of extracted text."""
    page_number: int
    text: str


@dataclass
class ParsedDocument:
    """Result of parsing a document file."""
    pages: List[ParsedPage] = field(default_factory=list)
    total_pages: int = 0
    full_text: str = ""
    metadata: dict = field(default_factory=dict)
    error: Optional[str] = None

    @property
    def success(self) -> bool:
        return self.error is None and len(self.pages) > 0


def parse_pdf(data: bytes) -> ParsedDocument:
    """
    Extract text from PDF using PyMuPDF (fitz) for robust extraction.
    Falls back to pypdf if fitz fails.
    """
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(stream=data, filetype="pdf")
        pages: List[ParsedPage] = []
        for i, page in enumerate(doc):
            text = page.get_text("text")
            if text.strip():
                pages.append(ParsedPage(page_number=i + 1, text=text))

        full_text = "\n\n".join(p.text for p in pages)
        metadata = dict(doc.metadata) if doc.metadata else {}
        total_pages = len(doc)
        doc.close()

        logger.info("PDF parsed with PyMuPDF", pages=total_pages, text_pages=len(pages))
        return ParsedDocument(
            pages=pages,
            total_pages=total_pages,
            full_text=full_text,
            metadata=metadata,
        )
    except ImportError:
        logger.warning("PyMuPDF not available, falling back to pypdf")
    except Exception as e:
        logger.warning("PyMuPDF failed, falling back to pypdf", error=str(e))

    # Fallback: pypdf
    try:
        from pypdf import PdfReader

        reader = PdfReader(io.BytesIO(data))
        pages: List[ParsedPage] = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            if text.strip():
                pages.append(ParsedPage(page_number=i + 1, text=text))

        full_text = "\n\n".join(p.text for p in pages)
        metadata = dict(reader.metadata) if reader.metadata else {}

        logger.info("PDF parsed with pypdf", pages=len(reader.pages), text_pages=len(pages))
        return ParsedDocument(
            pages=pages,
            total_pages=len(reader.pages),
            full_text=full_text,
            metadata=metadata,
        )
    except Exception as e:
        logger.error("PDF parsing failed completely", error=str(e))
        return ParsedDocument(error=f"Failed to parse PDF: {str(e)}")


def parse_docx(data: bytes) -> ParsedDocument:
    """
    Extract text from DOCX using python-docx.
    DOCX files don't have inherent page breaks, so we treat
    each paragraph as content and return a single logical page.
    """
    try:
        from docx import Document

        doc = Document(io.BytesIO(data))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        full_text = "\n\n".join(paragraphs)

        if not full_text.strip():
            # Also try extracting from tables
            table_texts = []
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(
                        cell.text.strip() for cell in row.cells if cell.text.strip()
                    )
                    if row_text:
                        table_texts.append(row_text)
            if table_texts:
                full_text = "\n".join(table_texts)

        pages = [ParsedPage(page_number=1, text=full_text)] if full_text.strip() else []

        # Try to extract metadata
        metadata = {}
        try:
            core_props = doc.core_properties
            if core_props.title:
                metadata["title"] = core_props.title
            if core_props.author:
                metadata["author"] = core_props.author
            if core_props.subject:
                metadata["subject"] = core_props.subject
        except Exception:
            pass

        logger.info(
            "DOCX parsed",
            paragraphs=len(paragraphs),
            chars=len(full_text),
        )
        return ParsedDocument(
            pages=pages,
            total_pages=1,
            full_text=full_text,
            metadata=metadata,
        )
    except Exception as e:
        logger.error("DOCX parsing failed", error=str(e))
        return ParsedDocument(error=f"Failed to parse DOCX: {str(e)}")


def parse_txt(data: bytes) -> ParsedDocument:
    """
    Extract text from plain text files.
    Attempts UTF-8, then Latin-1 encoding.
    """
    try:
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            text = data.decode("latin-1")

        if not text.strip():
            return ParsedDocument(error="Text file is empty.")

        pages = [ParsedPage(page_number=1, text=text)]
        logger.info("TXT parsed", chars=len(text))
        return ParsedDocument(
            pages=pages,
            total_pages=1,
            full_text=text,
        )
    except Exception as e:
        logger.error("TXT parsing failed", error=str(e))
        return ParsedDocument(error=f"Failed to parse TXT: {str(e)}")


def parse_document(data: bytes, file_type: str) -> ParsedDocument:
    """Route to the appropriate parser based on file type."""
    parsers = {
        "pdf": parse_pdf,
        "docx": parse_docx,
        "txt": parse_txt,
    }
    parser_fn = parsers.get(file_type)
    if not parser_fn:
        return ParsedDocument(error=f"Unsupported file type: {file_type}")
    return parser_fn(data)
