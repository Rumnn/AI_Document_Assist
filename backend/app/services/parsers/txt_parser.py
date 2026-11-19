"""Plain text / Markdown document parser."""
from app.services.parsers.base import BaseParser, ParsedDocument, PageContent


class TextParser(BaseParser):
    def parse(self, content: bytes) -> ParsedDocument:
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            text = content.decode("latin-1", errors="replace")

        text = text.strip()
        word_count = len(text.split())
        estimated_pages = max(1, (word_count + 499) // 500)

        return ParsedDocument(
            text=text,
            page_count=estimated_pages,
            pages=[PageContent(page_number=1, text=text)],
            metadata={"format": "plain_text", "word_count": word_count},
        )
