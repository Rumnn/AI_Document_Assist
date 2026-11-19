"""Integration and endpoint tests for Authentication (Register, Login, Refresh, Me)."""
from datetime import datetime, timezone
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import create_application
from app.models.models import User, RefreshToken
from app.core.security import hash_password, create_access_token
from app.api.v1.deps import get_db, get_current_user


@pytest.fixture
def app():
    return create_application()


@pytest.mark.asyncio
async def test_register_success(app):
    """POST /api/v1/auth/register creates new user account."""
    mock_db = AsyncMock()
    app.dependency_overrides[get_db] = lambda: mock_db

    now = datetime.now(timezone.utc)
    new_user = User(
        id=uuid.uuid4(),
        email="newuser@acme.io",
        full_name="New User",
        password_hash="mock",
        is_active=True,
        created_at=now,
        updated_at=now,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_email = AsyncMock(return_value=None)
        mock_repo.create = AsyncMock(return_value=new_user)
        mp.setattr("app.api.v1.routers.auth.UserRepository", lambda db: mock_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/register",
                json={
                    "email": "newuser@acme.io",
                    "password": "StrongPassword123!",
                    "full_name": "New User",
                },
            )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@acme.io"
        assert data["full_name"] == "New User"


@pytest.mark.asyncio
async def test_register_duplicate_email(app):
    """Registering an existing email raises 409 Conflict."""
    mock_db = AsyncMock()
    app.dependency_overrides[get_db] = lambda: mock_db

    existing_user = User(
        id=uuid.uuid4(),
        email="existing@acme.io",
        full_name="Existing User",
        password_hash="mock",
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_repo = MagicMock()
        mock_repo.get_by_email = AsyncMock(return_value=existing_user)
        mp.setattr("app.api.v1.routers.auth.UserRepository", lambda db: mock_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/register",
                json={
                    "email": "existing@acme.io",
                    "password": "StrongPassword123!",
                    "full_name": "Existing User",
                },
            )

        assert response.status_code == 409
        assert "Email already registered" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(app):
    """POST /api/v1/auth/login returns access and refresh tokens."""
    mock_db = AsyncMock()
    app.dependency_overrides[get_db] = lambda: mock_db

    hashed = hash_password("ValidPassword123!")
    user = User(
        id=uuid.uuid4(),
        email="user@acme.io",
        full_name="Valid User",
        password_hash=hashed,
        is_active=True,
    )

    with pytest.MonkeyPatch.context() as mp:
        mock_user_repo = MagicMock()
        mock_user_repo.get_by_email = AsyncMock(return_value=user)
        mp.setattr("app.api.v1.routers.auth.UserRepository", lambda db: mock_user_repo)

        mock_token_repo = MagicMock()
        mock_token_repo.create = AsyncMock()
        mp.setattr("app.api.v1.routers.auth.RefreshTokenRepository", lambda db: mock_token_repo)

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/login",
                json={"email": "user@acme.io", "password": "ValidPassword123!"},
            )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_get_current_user_me(app, mock_owner):
    """GET /api/v1/auth/me returns current user profile."""
    app.dependency_overrides[get_current_user] = lambda: mock_owner

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/auth/me")

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == mock_owner.email
    assert data["full_name"] == mock_owner.full_name
