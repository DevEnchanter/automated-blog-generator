# Project Structure

## Root Directory
```
automated-blog-generator/
├── frontend/           # React application
├── backend/           # FastAPI application
├── docs/              # Project documentation
└── README.md          # Project overview
```

## Frontend Structure
```
frontend/
├── public/                    # Static files
│   ├── assets/               # Images, fonts, etc.
│   │   ├── common/          # Shared components (buttons, inputs, etc.)
│   │   ├── layout/          # Layout components
│   │   └── features/        # Feature-specific components
│   │   └── index.html            # HTML entry point
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/          # Shared components (buttons, inputs, etc.)
│   │   │   ├── layout/          # Layout components
│   │   │   └── features/        # Feature-specific components
│   │   ├── pages/               # Page components
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── dashboard/      # Dashboard pages
│   │   │   └── blog/           # Blog management pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API and external service integrations
│   │   │   ├── api/           # API client and endpoints
│   │   │   └── firebase/      # Firebase configuration and services
│   │   ├── utils/             # Helper functions and utilities
│   │   ├── contexts/          # React contexts
│   │   ├── types/             # TypeScript type definitions
│   │   ├── styles/            # Global styles and theme
│   │   ├── constants/         # Constants and configuration
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── package.json           # Dependencies and scripts
│   ├── tsconfig.json         # TypeScript configuration
│   ├── vite.config.ts        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
```

## Backend Structure
```
backend/
├── app/
│   ├── api/              # API routes and endpoints
│   │   ├── v1/          # API version 1
│   │   ├── auth/        # Authentication endpoints
│   │   ├── posts/       # Post management endpoints
│   │   └── analytics/   # Analytics endpoints
│   ├── core/            # Core application code
│   │   ├── config.py    # Configuration settings
│   │   ├── security.py  # Security utilities
│   │   └── logging.py   # Logging configuration
│   ├── models/          # Data models and schemas
│   │   ├── user.py
│   │   ├── post.py
│   │   └── analytics.py
│   ├── services/        # Business logic
│   │   ├── ai/         # AI content generation
│   │   ├── firebase/   # Firebase integration
│   │   └── analytics/  # Analytics processing
│   ├── utils/          # Utility functions
│   └── main.py         # Application entry point
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── conftest.py    # Test configuration
├── requirements.txt    # Python dependencies
├── Dockerfile         # Container configuration
└── .env.example       # Environment variables template
```

## Documentation Structure
```
docs/
├── README.md                     # Documentation overview
├── prd/                         # Product Requirements
├── system-design/               # System Architecture
│   ├── README.md               # Overview
│   ├── api-flow.md             # API workflows
│   ├── database-schema.md      # Database structure
│   └── project-structure.md    # This file
├── development/                # Development guides
├── technical/                 # Technical specs
├── api/                      # API documentation
└── deployment/              # Deployment guides
```

## Key Files

### Frontend Configuration Files
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Build and development configuration
- `tailwind.config.js`: UI styling configuration
- `.env`: Environment variables

### Backend Configuration Files
- `requirements.txt`: Python dependencies
- `main.py`: Application entry point
- `config.py`: Configuration settings
- `.env`: Environment variables
- `Dockerfile`: Container configuration

### Development Tools
- `.gitignore`: Git ignore patterns
- `.eslintrc`: JavaScript/TypeScript linting
- `.prettierrc`: Code formatting
- `pytest.ini`: Python test configuration 