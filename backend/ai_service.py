from typing import Optional
import google.generativeai as genai
from pydantic import BaseModel

class BlogGenerationParams(BaseModel):
    topic: str
    tone: Optional[str] = "professional"
    length: Optional[str] = "medium"
    target_audience: Optional[str] = "general"
    keywords: Optional[list[str]] = []

class AIService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    async def generate_blog(self, params: BlogGenerationParams) -> str:
        prompt = self._create_prompt(params)
        response = await self.model.generate_content_async(prompt)
        return response.text

    def _create_prompt(self, params: BlogGenerationParams) -> str:
        length_guide = {
            "short": "500-800 words",
            "medium": "1000-1500 words",
            "long": "2000-2500 words"
        }
        
        prompt = f"""Write a blog post about {params.topic}.
        Tone: {params.tone}
        Target Length: {length_guide.get(params.length, "1000-1500 words")}
        Target Audience: {params.target_audience}
        """
        
        if params.keywords:
            prompt += f"\nInclude these keywords naturally: {', '.join(params.keywords)}"
            
        prompt += "\nFormat the blog post with proper headings, paragraphs, and a conclusion."
        return prompt 