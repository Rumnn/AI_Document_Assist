"""Base interface and data contracts for document parsers."""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Dict, Any


@dataclass
class PageContent:
    page_number: int
    text: str


@dataclass
class ParsedDocument:
    text: str
    page_count: int
    pages: List[PageContent] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


class BaseParser(ABC):
    @abstractmethod
    def parse(self, content: bytes) -> ParsedDocument:
        """Parse raw document bytes into extracted text and structured pages."""
        pass
