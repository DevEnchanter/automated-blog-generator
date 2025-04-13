import pytest
from unittest.mock import Mock, patch
from ai_service import AIService, BlogGenerationParams, GenerationError, InvalidAPIKeyError, BlogLength

@pytest.fixture
def ai_service():
    with patch('google.generativeai.GenerativeModel') as mock_model:
        service = AIService("test_api_key")
        service.model = mock_model
        yield service

@pytest.mark.asyncio
async def test_generate_blog_success(ai_service):
    # Arrange
    params = BlogGenerationParams(
        topic="Test Topic",
        tone="professional",
        length=BlogLength.SHORT,
        target_audience="general",
        keywords=["test", "blog"]
    )
    mock_response = Mock()
    mock_response.text = "Generated blog content"
    ai_service.model.generate_content_async.return_value = mock_response

    # Act
    result = await ai_service.generate_blog(params)

    # Assert
    assert result == "Generated blog content"
    ai_service.model.generate_content_async.assert_called_once()

@pytest.mark.asyncio
async def test_generate_blog_empty_response(ai_service):
    # Arrange
    params = BlogGenerationParams(
        topic="Test Topic"
    )
    mock_response = Mock()
    mock_response.text = ""
    ai_service.model.generate_content_async.return_value = mock_response

    # Act & Assert
    with pytest.raises(GenerationError, match="Generated content is empty"):
        await ai_service.generate_blog(params)

@pytest.mark.asyncio
async def test_generate_blog_api_error(ai_service):
    # Arrange
    params = BlogGenerationParams(
        topic="Test Topic"
    )
    ai_service.model.generate_content_async.side_effect = Exception("API Error")

    # Act & Assert
    with pytest.raises(GenerationError, match="Failed to generate blog after 3 attempts"):
        await ai_service.generate_blog(params)

def test_invalid_api_key():
    # Act & Assert
    with pytest.raises(InvalidAPIKeyError):
        AIService("")

    with pytest.raises(InvalidAPIKeyError):
        AIService("your_gemini_api_key_here")

def test_create_prompt():
    # Arrange
    service = AIService("test_api_key")
    params = BlogGenerationParams(
        topic="Test Topic",
        tone="professional",
        length=BlogLength.MEDIUM,
        target_audience="technical",
        keywords=["test", "blog"]
    )

    # Act
    prompt = service._create_prompt(params)

    # Assert
    assert "Test Topic" in prompt
    assert "professional" in prompt
    assert "1000-1500 words" in prompt
    assert "technical" in prompt
    assert "test, blog" in prompt 