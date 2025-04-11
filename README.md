# Automated Blog Generator

An AI-powered automated blog content generator and management system built with React, FastAPI, and Gemini API.

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS
- Vite
- Firebase Authentication

### Backend
- Python 3.9+
- FastAPI
- Firebase Admin SDK
- Google Gemini API

### Database & Storage
- Firebase Firestore
- Firebase Storage

## Getting Started

### Prerequisites
1. Node.js >= 16.x
2. Python >= 3.9
3. Firebase account and project setup
4. Gemini API key

### Environment Setup
1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Unix/MacOS
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Running the Application
1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Features
- AI-powered content generation
- Post scheduling and management
- Category and tag management
- SEO optimization
- Analytics dashboard
- User authentication

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT 