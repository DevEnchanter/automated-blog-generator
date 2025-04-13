import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import firestore as cloud_firestore
import os
from pathlib import Path
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK and return Firestore client."""
    try:
        # Check if Firebase app is already initialized
        if not firebase_admin._apps:
            # Get credentials from environment variables
            project_id = os.getenv("FIREBASE_PROJECT_ID")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY")
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL")

            if not all([project_id, private_key, client_email]):
                missing_vars = []
                if not project_id:
                    missing_vars.append("FIREBASE_PROJECT_ID")
                if not private_key:
                    missing_vars.append("FIREBASE_PRIVATE_KEY")
                if not client_email:
                    missing_vars.append("FIREBASE_CLIENT_EMAIL")
                raise Exception(f"Missing required Firebase credentials: {', '.join(missing_vars)}")

            # Create credentials from environment variables
            cred_dict = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key.replace("\\n", "\n"),
                "client_email": client_email,
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            
            logger.info("Initializing Firebase Admin SDK...")
            # Initialize Firebase Admin SDK
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
            
        # Return Firestore client
        return firestore.client()
    except Exception as e:
        logger.error(f"Firebase initialization error: {str(e)}")
        raise Exception(f"Failed to initialize Firebase: {str(e)}")

# Initialize Firestore client
try:
    db = initialize_firebase()
    logger.info("Firestore client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Firestore client: {str(e)}")
    raise

def get_firestore_client():
    """Get the initialized Firestore client."""
    return db 