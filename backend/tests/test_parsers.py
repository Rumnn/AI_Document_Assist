"""Unit tests for document parsers (PDF, DOCX, TXT)."""
import io
import pytest
from docx import Document as CreateDocx
from pypdf import PdfWriter

from app.services.parsers.base import ParsedDocument
from app.services.parsers.factory import get_parser
from app.services.parsers.txt_parser import TextParser
from app.services.parsers.pdf_parser import PDFParser
from app.services.parsers.docx_parser import DOCXParser


def test_txt_parser():
    content = "DocuMind PRO delivers enterprise RAG search.\nSecond paragraph.".encode("utf-8")
    parser = TextParser()
    result = parser.parse(content)

    assert isinstance(result, ParsedDocument)
    assert "DocuMind PRO" in result.text
    assert result.page_count >= 1
    assert len(result.pages) == 1
    assert result.pages[0].page_number == 1


def test_pdf_parser_with_generated_pdf():
    # Dynamically generate a minimal valid 2-page PDF
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    writer.add_blank_page(width=72, height=72)

    buf = io.BytesIO()
    writer.write(buf)
    pdf_bytes = buf.getvalue()

    parser = PDFParser()
    result = parser.parse(pdf_bytes)

    assert isinstance(result, ParsedDocument)
    assert result.page_count == 2
    assert len(result.pages) == 2
    assert result.pages[0].page_number == 1
    assert result.pages[1].page_number == 2


def test_docx_parser_with_generated_docx():
    # Dynamically generate a minimal valid DOCX
    doc = CreateDocx()
    doc.add_heading("Q3 Financial Overview", level=1)
    doc.add_paragraph("Total revenue reached $42M in Q3.")
    table = doc.add_table(rows=2, cols=2)
    table.cell(0, 0).text = "Metric"
    table.cell(0, 1).text = "Value"
    table.cell(1, 0).text = "ARR"
    table.cell(1, 1).text = "$120M"

    buf = io.BytesIO()
    doc.save(buf)
    docx_bytes = buf.getvalue()

    parser = DOCXParser()
    result = parser.parse(docx_bytes)

    assert isinstance(result, ParsedDocument)
    assert "Q3 Financial Overview" in result.text
    assert "Total revenue reached $42M" in result.text
    assert "Metric | Value" in result.text
    assert result.page_count >= 1


def test_parser_factory():
    assert isinstance(get_parser("pdf"), PDFParser)
    assert isinstance(get_parser("docx"), DOCXParser)
    assert isinstance(get_parser("txt"), TextParser)

    with pytest.raises(Exception):
        get_parser("unknown_format")
