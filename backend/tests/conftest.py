"""Pytest configuration and shared fixtures for backend tests."""
from datetime import datetime, timezone
import uuid
import pytest
from httpx import AsyncClient, ASGITransport

from app.main import create_application
from app.models.models import User, WorkspaceRole
from app.core.security import create_access_token


@pytest.fixture
def mock_owner():
    now = datetime.now(timezone.utc)
    return User(
        id=uuid.uuid4(),
        email="owner@acme.io",
        password_hash="mock_hash",
        full_name="Alice Owner",
        is_active=True,
        is_superuser=False,
        created_at=now,
        updated_at=now,
    )


@pytest.fixture
def mock_admin():
    return User(
        id=uuid.uuid4(),
        email="admin@acme.io",
        password_hash="mock_hash",
        full_name="Bob Admin",
        is_active=True,
        is_superuser=False,
    )


@pytest.fixture
def mock_member():
    return User(
        id=uuid.uuid4(),
        email="member@acme.io",
        password_hash="mock_hash",
        full_name="Charlie Member",
        is_active=True,
        is_superuser=False,
    )


@pytest.fixture
def mock_viewer():
    return User(
        id=uuid.uuid4(),
        email="viewer@acme.io",
        password_hash="mock_hash",
        full_name="Dana Viewer",
        is_active=True,
        is_superuser=False,
    )


@pytest.fixture
def owner_token(mock_owner):
    return create_access_token(str(mock_owner.id))


@pytest.fixture
def admin_token(mock_admin):
    return create_access_token(str(mock_admin.id))


@pytest.fixture
def member_token(mock_member):
    return create_access_token(str(mock_member.id))


@pytest.fixture
def viewer_token(mock_viewer):
    return create_access_token(str(mock_viewer.id))
