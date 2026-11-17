###############################################################################
# Backend Dockerfile – multi-stage
###############################################################################

# ── Base stage ────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS base

WORKDIR /app

# System dependencies for document parsing (poppler, libmagic, etc.)
# NOTE: libgl1-mesa-glx was removed in Debian Trixie; use libgl1 + libglx-mesa0
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libmagic1 \
    poppler-utils \
    tesseract-ocr \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Development stage ─────────────────────────────────────────────────────────
FROM base AS development

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# Install dev-only tools
RUN pip install --no-cache-dir watchfiles

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

COPY . .

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
