"""DOCX document parser using python-docx."""
import io
import structlog
from docx import Document as DocxDocument

from app.services.parsers.base import BaseParser, ParsedDocument, PageContent

logger = structlog.get_logger(__name__)


class DOCXParser(BaseParser):
    def parse(self, content: bytes) -> ParsedDocument:
        stream = io.BytesIO(content)
        doc = DocxDocument(stream)

        text_blocks: list[str] = []

        # 1. Paragraphs
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text:
                text_blocks.append(text)

        # 2. Tables
        for table in doc.tables:
            for row in table.rows:
                row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if row_cells:
                    text_blocks.append(" | ".join(row_cells))

        full_text = "\n\n".join(text_blocks)

        # DOCX doesn't have fixed pagination; calculate estimated page count (~500 words/page)
        word_count = len(full_text.split())
        estimated_pages = max(1, (word_count + 499) // 500)

        # Map to pseudo-pages for unified chunking and reference
        pages = [
            PageContent(page_number=1, text=full_text)
        ]

        metadata = {}
        if doc.core_properties:
            metadata = {
                "title": doc.core_properties.title,
                "author": doc.core_properties.author,
                "created": str(doc.core_properties.created) if doc.core_properties.created else None,
                "modified": str(doc.core_properties.modified) if doc.core_properties.modified else None,
            }

        return ParsedDocument(
            text=full_text,
            page_count=estimated_pages,
            pages=pages,
            metadata=metadata,
        )
