import os
import google.generativeai as genai
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    """Service for interacting with Google's Gemini API."""
    
    def __init__(self):
        """Initialize Gemini API with API key."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def generate_blog_post(self, 
                               topic: str, 
                               keywords: List[str] = None,
                               tone: str = "professional",
                               length: str = "medium") -> str:
        """Generate a blog post using Gemini API."""
        try:
            prompt = f"""
            Write a {length} blog post about {topic}.
            Tone: {tone}
            Keywords to include: {', '.join(keywords) if keywords else 'None specified'}
            
            The blog post should be well-structured with:
            1. An engaging introduction
            2. Clear main points
            3. Supporting evidence or examples
            4. A strong conclusion
            
            Format the content in markdown.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Failed to generate blog post: {str(e)}")
    
    async def generate_meta_description(self, content: str) -> str:
        """Generate a meta description for a blog post."""
        try:
            prompt = f"""
            Generate a compelling meta description (max 160 characters) for this blog post:
            
            {content}
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Failed to generate meta description: {str(e)}")
    
    async def generate_slug(self, title: str) -> str:
        """Generate a URL-friendly slug from a title."""
        try:
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
            
            response = self.model.generate_content(prompt)
            return response.text.strip().lower()
        except Exception as e:
            raise Exception(f"Failed to generate slug: {str(e)}") 