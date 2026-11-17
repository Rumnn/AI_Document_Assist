-- PostgreSQL initialization script
-- Runs once when the postgres container is first created.
-- The database and user are already created by POSTGRES_DB / POSTGRES_USER env vars.

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- for full-text search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- for accent-insensitive search
