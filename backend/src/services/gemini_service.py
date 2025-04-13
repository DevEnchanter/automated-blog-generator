import os
import google.generativeai as genai
from typing import List, Optional
from dotenv import load_dotenv
import asyncio
import logging
import time
from google.api_core import retry

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Custom retry predicate for rate limits
def is_rate_limit_error(exception):
    return isinstance(exception, Exception) and "quota" in str(exception).lower()

# Custom retry strategy
custom_retry = retry.Retry(
    predicate=retry.if_exception_type(Exception),
    initial=1.0,
    maximum=60.0,
    multiplier=2.0,
    deadline=300.0,
)

class GeminiService:
    """Service for interacting with Google's Gemini API."""
    
    def __init__(self):
        """Initialize Gemini API with API key."""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY environment variable is not set")
            
            # Clean up the API key (remove any whitespace or quotes)
            api_key = api_key.strip().strip('"').strip("'")
            
            logger.info("Initializing Gemini API...")
            genai.configure(api_key=api_key)
            
            # List available models
            models = genai.list_models()
            logger.info(f"Available models: {[m.name for m in models]}")
            
            # Use gemini-2.0-flash model
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Test the API connection with a simple prompt
            test_prompt = "Hello, this is a test."
            try:
                response = self.model.generate_content(test_prompt)
                if not response.text:
                    raise ValueError("Failed to get response from Gemini API")
            except Exception as e:
                if "quota" in str(e).lower():
                    logger.warning("API quota exceeded. Please check your billing status.")
                    raise
                raise
            
            logger.info("Gemini API initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini API: {str(e)}")
            raise
    
    @retry.Retry(predicate=is_rate_limit_error, initial=1.0, maximum=60.0, multiplier=2.0, deadline=300.0)
    async def generate_blog_post(self, 
                               topic: str, 
                               keywords: List[str] = None,
                               tone: str = "professional",
                               length: str = "medium",
                               target_audience: str = "general") -> str:
        """Generate a blog post using Gemini API."""
        try:
            logger.info(f"Generating blog post with topic: {topic}")
            prompt = f"""
            Write a {length} blog post about {topic} for a {target_audience} audience.
            Tone: {tone}
            Keywords to include: {', '.join(keywords) if keywords else 'None specified'}
            
            The blog post should be well-structured with:
            1. An engaging introduction
            2. Clear main points
            3. Supporting evidence or examples
            4. A strong conclusion
            
            Format the content in markdown.
            """
            
            logger.info("Sending request to Gemini API...")
            # Run the synchronous generate_content in a thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")
                
            logger.info("Received response from Gemini API")
            return response.text
        except Exception as e:
            if "quota" in str(e).lower():
                logger.warning("API quota exceeded. Please check your billing status.")
                raise
            logger.error(f"Failed to generate blog post: {str(e)}")
            raise Exception(f"Failed to generate blog post: {str(e)}")
    
    @retry.Retry(predicate=is_rate_limit_error, initial=1.0, maximum=60.0, multiplier=2.0, deadline=300.0)
    async def generate_meta_description(self, content: str) -> str:
        """Generate a meta description for a blog post."""
        try:
            logger.info("Generating meta description...")
            prompt = f"""
            Generate a compelling meta description (max 160 characters) for this blog post:
            
            {content}
            """
            
            logger.info("Sending request to Gemini API for meta description...")
            # Run the synchronous generate_content in a thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")
                
            logger.info("Received meta description from Gemini API")
            return response.text.strip()
        except Exception as e:
            if "quota" in str(e).lower():
                logger.warning("API quota exceeded. Please check your billing status.")
                raise
            logger.error(f"Failed to generate meta description: {str(e)}")
            raise Exception(f"Failed to generate meta description: {str(e)}")
    
    @retry.Retry(predicate=is_rate_limit_error, initial=1.0, maximum=60.0, multiplier=2.0, deadline=300.0)
    async def generate_slug(self, title: str) -> str:
        """Generate a URL-friendly slug from a title."""
        try:
            logger.info(f"Generating slug for title: {title}")
            prompt = f"""
            Convert this blog post title into a URL-friendly slug:
            
            Title: {title}
            
            Rules:
            1. Use lowercase
            2. Replace spaces with hyphens
            3. Remove special characters
            4. Keep it concise
            5. Make it SEO-friendly
            """
            
            logger.info("Sending request to Gemini API for slug...")
            # Run the synchronous generate_content in a thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")
                
            logger.info("Received slug from Gemini API")
            return response.text.strip().lower()
        except Exception as e:
            if "quota" in str(e).lower():
                logger.warning("API quota exceeded. Please check your billing status.")
                raise
            logger.error(f"Failed to generate slug: {str(e)}")
            raise Exception(f"Failed to generate slug: {str(e)}") 