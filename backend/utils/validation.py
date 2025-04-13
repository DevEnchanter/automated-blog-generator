from typing import Any, Dict
from pydantic import BaseModel, ValidationError

def validate_model(model_class: type[BaseModel], data: Dict[str, Any]) -> BaseModel:
    """Validate data against a Pydantic model."""
    try:
        return model_class(**data)
    except ValidationError as e:
        raise ValueError(f"Validation error: {str(e)}")

def validate_slug(slug: str) -> str:
    """Validate and format a URL slug."""
    if not slug:
        raise ValueError("Slug cannot be empty")
    # Remove special characters and convert to lowercase
    slug = slug.lower().strip()
    slug = "".join(c if c.isalnum() or c == "-" else "-" for c in slug)
    # Remove multiple consecutive hyphens
    slug = "-".join(filter(None, slug.split("-")))
    return slug 