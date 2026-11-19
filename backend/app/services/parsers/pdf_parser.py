"""PDF document parser using pypdf."""
import io
import structlog
from pypdf import PdfReader

from app.services.parsers.base import BaseParser, ParsedDocument, PageContent

logger = structlog.get_logger(__name__)


class PDFParser(BaseParser):
    def parse(self, content: bytes) -> ParsedDocument:
        stream = io.BytesIO(content)
        reader = PdfReader(stream)

        pages: list[PageContent] = []
        all_text_parts: list[str] = []

        total_pages = len(reader.pages)

        for idx, page in enumerate(reader.pages, start=1):
            try:
                page_text = page.extract_text() or ""
                page_text = page_text.strip()
                pages.append(PageContent(page_number=idx, text=page_text))
                if page_text:
                    all_text_parts.append(page_text)
            except Exception as e:
                logger.warning("Error extracting text from PDF page", page=idx, error=str(e))
                pages.append(PageContent(page_number=idx, text=""))

        # Extract metadata
        meta = {}
        if reader.metadata:
            meta = {
                "title": reader.metadata.title,
                "author": reader.metadata.author,
                "creator": reader.metadata.creator,
                "producer": reader.metadata.producer,
            }

        full_text = "\n\n".join(all_text_parts)
        return ParsedDocument(
            text=full_text,
            page_count=total_pages,
            pages=pages,
            metadata=meta,
        )
