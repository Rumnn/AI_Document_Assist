"""Document parser factory."""
from typing import Dict, Type
from fastapi import HTTPException

from app.services.parsers.base import BaseParser
from app.services.parsers.pdf_parser import PDFParser
from app.services.parsers.docx_parser import DOCXParser
from app.services.parsers.txt_parser import TextParser

_PARSER_REGISTRY: Dict[str, Type[BaseParser]] = {
    "pdf": PDFParser,
    "docx": DOCXParser,
    "txt": TextParser,
}


def get_parser(file_type: str) -> BaseParser:
    """Get the appropriate parser instance for a given file type."""
    normalized_type = file_type.lower().strip()
    parser_cls = _PARSER_REGISTRY.get(normalized_type)
    if not parser_cls:
        raise HTTPException(
            status_code=400,
            detail=f"No parser available for file type: '{file_type}'.",
        )
    return parser_cls()
