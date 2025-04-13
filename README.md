# Automated Blog Generator

A full-stack web application that automatically generates blog posts using AI. Built with React, FastAPI, and Google's Gemini API.

## Tech Stack

### Frontend
- React with TypeScript
- Mantine UI (component library)
- Zustand (state management)
- Hosted on Vercel

### Backend
- Python 3.11
- FastAPI (API framework)
- Google's Gemini API (AI content generation)
- Firebase Firestore (database)
- Hosted on Vercel

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core configuration
│   │   ├── db/           # Firestore models and configs
│   │   ├── models/       # Data models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   ├── tests/            # Backend tests
│   ├── requirements.txt  # Python dependencies
│   └── vercel.json       # Vercel configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   ├── store/        # Zustand store
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   └── vercel.json       # Vercel configuration
│
└── docs/                 # Documentation
```

## Features

- AI-powered blog post generation using Gemini API
- Rich text editor with Mantine
- Post categorization and tagging
- SEO optimization
- Responsive design
- Firebase Authentication
- Serverless deployment on Vercel
- Real-time analytics

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Firebase account
- Google Cloud account (for Gemini API)
- Vercel account

### Backend Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and Gemini API configuration
   ```

4. Start the development server:
   ```bash
   uvicorn src.main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- Backend API documentation: http://localhost:8000/docs
- Frontend development server: http://localhost:5173

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

The application is deployed on Vercel's platform:

### Frontend
- Automatic deployments from main branch
- Preview deployments for pull requests
- Environment variables managed in Vercel dashboard
- Edge network CDN for optimal performance

### Backend
- Serverless Python functions on Vercel
- Automatic scaling
- Zero configuration deployments
- Integrated with frontend deployment

For detailed deployment instructions, see [Deployment Guide](docs/deployment/README.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 