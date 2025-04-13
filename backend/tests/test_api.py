import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base, get_db
from main import app
import os
from unittest.mock import AsyncMock, patch
from ai_service import BlogGenerationParams

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

@pytest.fixture
def test_client():
    return TestClient(app)

@pytest.fixture
def mock_current_user():
    return {"email": "test@example.com", "id": 1}

@pytest.fixture
def mock_ai_service():
    with patch('main.app.ai_service') as mock:
        mock.generate_blog = AsyncMock()
        yield mock

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Automated Blog Generator API"}

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_register_user(client):
    response = client.post(
        "/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data

def test_login_user(client):
    # First register a user
    client.post(
        "/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    
    # Then try to login
    response = client.post(
        "/token",
        data={"username": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data

def test_create_blog(client):
    # First register and login
    register_response = client.post(
        "/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    token = register_response.json()["access_token"]
    
    # Create a blog post
    response = client.post(
        "/blog",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Blog",
            "content": "This is a test blog post",
            "author": "test@example.com"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Blog"
    assert data["content"] == "This is a test blog post"
    assert data["author"] == "test@example.com"

def test_get_blogs(client):
    # First register and login
    register_response = client.post(
        "/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    token = register_response.json()["access_token"]
    
    # Create a blog post
    client.post(
        "/blog",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Blog",
            "content": "This is a test blog post",
            "author": "test@example.com"
        }
    )
    
    # Get all blogs
    response = client.get(
        "/blogs",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == "Test Blog"

def test_generate_blog_unauthorized(test_client):
    # Arrange
    params = {
        "topic": "Test Topic",
        "tone": "professional",
        "length": "medium",
        "target_audience": "general",
        "keywords": ["test", "blog"]
    }

    # Act
    response = test_client.post("/api/blogs/generate", json=params)

    # Assert
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]

@pytest.mark.asyncio
async def test_generate_blog_success(test_client, mock_current_user, mock_ai_service):
    # Arrange
    params = {
        "topic": "Test Topic",
        "tone": "professional",
        "length": "medium",
        "target_audience": "general",
        "keywords": ["test", "blog"]
    }
    mock_ai_service.generate_blog.return_value = "Generated blog content"

    with patch('main.get_current_user', return_value=mock_current_user):
        # Act
        response = test_client.post("/api/blogs/generate", json=params)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"content": "Generated blog content"}
        mock_ai_service.generate_blog.assert_called_once()

@pytest.mark.asyncio
async def test_generate_blog_validation_error(test_client, mock_current_user):
    # Arrange
    params = {
        "topic": "",  # Empty topic should fail validation
        "tone": "professional"
    }

    with patch('main.get_current_user', return_value=mock_current_user):
        # Act
        response = test_client.post("/api/blogs/generate", json=params)

        # Assert
        assert response.status_code == 422
        assert "validation error" in response.json()["detail"][0]["msg"].lower()

@pytest.mark.asyncio
async def test_generate_blog_rate_limit(test_client, mock_current_user):
    # Arrange
    params = {
        "topic": "Test Topic",
        "tone": "professional"
    }

    with patch('main.get_current_user', return_value=mock_current_user):
        # Act
        # Make multiple requests to trigger rate limit
        responses = [
            test_client.post("/api/blogs/generate", json=params)
            for _ in range(10)  # Assuming rate limit is less than 10
        ]

        # Assert
        assert any(r.status_code == 429 for r in responses)
        rate_limited = next(r for r in responses if r.status_code == 429)
        assert "rate limit exceeded" in rate_limited.json()["detail"].lower()

@pytest.mark.asyncio
async def test_create_blog_success(test_client, mock_current_user):
    # Arrange
    blog_data = {
        "title": "Test Blog",
        "content": "Test content",
        "status": "draft"
    }

    with patch('main.get_current_user', return_value=mock_current_user):
        # Act
        response = test_client.post("/blog", json=blog_data)

        # Assert
        assert response.status_code == 200
        assert response.json()["title"] == "Test Blog"
        assert response.json()["author"] == "test@example.com"
        assert response.json()["status"] == "draft"
        assert "id" in response.json()
        assert "created_at" in response.json()
        assert "updated_at" in response.json() 