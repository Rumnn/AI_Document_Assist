# AI Document Assistant

> An AI-powered Document Management and Knowledge Retrieval Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://postgresql.org)
[![Qdrant](https://img.shields.io/badge/Qdrant-1.12-purple.svg)](https://qdrant.tech)

## Overview

AI Document Assistant lets users upload documents (PDF, DOCX, TXT), organize them in workspaces, and interact via an AI chatbot powered by **Retrieval-Augmented Generation (RAG)** using Google Gemini + BGE-M3 embeddings.

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐
│  Next.js    │───▶│  FastAPI    │───▶│  PostgreSQL          │
│  Frontend   │    │  Backend    │    │  (source of truth)   │
└─────────────┘    └──────┬──────┘    └─────────────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Qdrant  │ │  Redis   │ │  MinIO   │
        │  Vectors │ │  Broker  │ │  Files   │
        └──────────┘ └────┬─────┘ └──────────┘
                          ▼
                    ┌──────────┐
                    │  Celery  │
                    │  Worker  │
                    └──────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| AI | Google Gemini, BAAI/bge-m3, BAAI/bge-reranker-v2-m3 |
| Vector DB | Qdrant (dense + sparse hybrid search) |
| Database | PostgreSQL 16 |
| Queue | Celery + Redis |
| Storage | MinIO (S3-compatible) |
| Infra | Docker, Docker Compose, Nginx |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24
- Docker Compose v2
- Node.js ≥ 20 (for local frontend dev without Docker)
- Python ≥ 3.12 (for local backend dev without Docker)
- Google Gemini API key

## Quick Start

### 1. Clone and configure

```bash
git clone <repo-url>
cd ai-document-assistant
cp .env.example .env
# Edit .env and fill in real values, especially GEMINI_API_KEY
```

### 2. Start all services

```bash
docker compose up -d
```

This starts: PostgreSQL, Redis, Qdrant, MinIO, Backend (FastAPI), Worker (Celery), Frontend (Next.js).

### 3. Run database migrations

```bash
docker compose exec backend alembic upgrade head
```

### 4. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/v1/docs |
| MinIO Console | http://localhost:9001 |
| Qdrant Dashboard | http://localhost:6333/dashboard |

## Development (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Project Structure

```
ai-document-assistant/
├── frontend/              # Next.js 15 App Router
│   └── src/
│       ├── app/           # Pages and layouts
│       ├── components/    # Reusable components
│       └── lib/           # API client, stores, utils
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── api/v1/        # Route handlers
│   │   ├── ai/            # RAG pipeline components
│   │   ├── core/          # Config, security, logging
│   │   ├── db/            # SQLAlchemy sessions
│   │   ├── models/        # ORM models
│   │   ├── repositories/  # Data access layer
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── workers/       # Celery tasks
│   └── alembic/           # Database migrations
├── infrastructure/
│   ├── docker/            # Dockerfiles, init scripts
│   ├── nginx/             # Nginx config
│   └── qdrant/            # Qdrant config
├── docs/
│   ├── architecture/      # Architecture decision records
│   ├── database/          # Schema diagrams
│   └── api/               # API documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Development Roadmap

- [x] **Phase 1**: Foundation – monorepo, Docker Compose, FastAPI skeleton, Next.js skeleton
- [ ] **Phase 2**: Authentication – JWT, refresh tokens, RBAC, workspaces
- [ ] **Phase 3**: Document Management – upload, MinIO, Celery, PDF/DOCX parsing
- [ ] **Phase 4**: RAG Ingestion – chunking, BGE-M3 embeddings, Qdrant indexing
- [ ] **Phase 5**: RAG Retrieval – hybrid search, reranking, Gemini integration
- [ ] **Phase 6**: Advanced Features – streaming, multi-doc Q&A, summarization
- [ ] **Phase 7**: Testing & Deployment – tests, evaluation, production Docker

## API Documentation

Interactive API docs available at: http://localhost:8000/api/v1/docs

## Security Notes

- Never commit `.env` files
- All secrets must be set via environment variables
- JWT access tokens expire in 30 minutes; refresh tokens in 30 days
- Workspace-level data isolation enforced on every request
- Qdrant queries always filtered by workspace_id

## License

MIT
