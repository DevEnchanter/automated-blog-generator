from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
import logging # Import logging

logger = logging.getLogger(__name__) # Setup logger
security = HTTPBearer()

async def get_current_user_or_anonymous(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verifies the Firebase ID token from the Authorization header.
    
    Allows both fully authenticated and anonymous users.
    Returns the decoded token dictionary if valid.
    Raises HTTPException 401 otherwise.
    """
    logger.info("Dependency 'get_current_user_or_anonymous' called.") # Log entry
    if credentials is None:
        logger.warning("No credentials found in request.") # Log missing credentials
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        token = credentials.credentials
        logger.info(f"Attempting to verify token: {token[:10]}...{token[-5:]}") # Log token (partially)
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token.get('uid')
        logger.info(f"Token verified successfully for UID: {user_id}") # Log success
        return decoded_token 
    except Exception as e:
        logger.error(f"Token verification failed: {e}", exc_info=True) # Log the full error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_authenticated_user(decoded_token: dict = Depends(get_current_user_or_anonymous)) -> dict:
    """Ensures the user token is valid and the user is NOT anonymous.
    
    Relies on the get_current_user_or_anonymous dependency to verify the token first.
    Returns the decoded token dictionary if valid and not anonymous.
    Raises HTTPException 401 if the user is anonymous.
    """
    # Check the sign-in provider within the decoded token
    firebase_info = decoded_token.get('firebase', {})
    sign_in_provider = firebase_info.get('sign_in_provider')
    
    is_anonymous = sign_in_provider == 'anonymous'
    
    if is_anonymous:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, # Could also use 403 Forbidden
            detail="Full authentication required, anonymous access not allowed.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return decoded_token 