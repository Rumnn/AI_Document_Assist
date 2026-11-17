"""
Background Celery tasks.
Phase 1: skeleton only. Full implementation in Phase 4 (RAG Ingestion).
"""
import structlog
from app.workers.celery_app import celery_app

logger = structlog.get_logger(__name__)


@celery_app.task(bind=True, name="app.workers.tasks.process_document", max_retries=3)
def process_document(self, document_id: str):
    """
    Process an uploaded document:
    1. Extract text
    2. Normalize and chunk
    3. Generate embeddings
    4. Index in Qdrant

    Full implementation: Phase 4.
    """
    logger.info("Processing document", document_id=document_id)
    # TODO: implement in Phase 4
    return {"status": "queued", "document_id": document_id}
