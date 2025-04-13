from typing import Any, Dict
from fastapi import HTTPException
from functools import wraps

class AppError(Exception):
    """Base exception for application errors."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

def handle_errors(func):
    """Decorator to handle errors and convert them to HTTP exceptions."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except AppError as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return wrapper

def create_error_response(message: str, status_code: int = 500) -> Dict[str, Any]:
    """Create a standardized error response."""
    return {
        "error": {
            "message": message,
            "status_code": status_code
        }
    } 