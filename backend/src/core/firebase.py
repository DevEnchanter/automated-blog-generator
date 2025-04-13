import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import firestore as cloud_firestore
import os
from pathlib import Path
from dotenv import load_dotenv

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
                raise Exception("Missing required Firebase credentials in environment variables")

            # Create credentials from environment variables
            cred_dict = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key.replace("\\n", "\n") if private_key else "",
                "client_email": client_email,
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            
            # Initialize Firebase Admin SDK
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            
        # Return Firestore client
        return firestore.client()
    except Exception as e:
        print(f"Firebase initialization error: {str(e)}")
        raise Exception(f"Failed to initialize Firebase: {str(e)}")

# Initialize Firestore client
db = initialize_firebase()

def get_firestore_client():
    """Get the initialized Firestore client."""
    return db 