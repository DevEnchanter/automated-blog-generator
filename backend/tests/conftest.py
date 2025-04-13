import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.core.firebase import initialize_firebase
import os
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(scope="session")
def test_client():
    """Create a test client for the FastAPI application."""
    return TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_firebase():
    """Initialize Firebase for testing."""
    initialize_firebase()
    yield
    # Cleanup if needed 