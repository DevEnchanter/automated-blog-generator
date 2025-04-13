# Development Guidelines

## Code Standards

### General Guidelines
- Follow clean code principles
- Write self-documenting code
- Keep functions small and focused
- Use meaningful variable names
- Add comments only when necessary
- Follow the DRY principle

### TypeScript/React (Frontend)
- Use TypeScript for all new code
- Create reusable components
- Implement proper prop types
- Use functional components
- Follow React hooks best practices
- Implement proper error boundaries
- Use proper state management

### Python/FastAPI (Backend)
- Follow PEP 8 style guide
- Use type hints
- Implement proper error handling
- Write comprehensive tests
- Use async/await properly
- Follow REST API best practices
- Document all endpoints

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── store/         # Zustand store
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
└── tests/             # Frontend tests
```

### Backend Structure
```
backend/
├── src/
│   ├── api/          # API routes
│   ├── core/         # Core configuration
│   ├── db/           # Database models
│   ├── services/     # Business logic
│   ├── schemas/      # Pydantic schemas
│   └── utils/        # Utility functions
└── tests/            # Backend tests
```

## Development Workflow

### Setting Up Local Environment

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd automated-blog-generator
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

### Git Workflow

1. **Branch Naming**
   - Feature: `feature/description`
   - Bug Fix: `fix/description`
   - Hotfix: `hotfix/description`
   - Release: `release/v1.x.x`

2. **Commit Messages**
   ```
   type(scope): description

   [optional body]
   [optional footer]
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. **Pull Request Process**
   - Create feature branch
   - Make changes
   - Run tests
   - Create pull request
   - Get code review
   - Merge after approval

## Testing

### Frontend Testing
- Use Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests
- Test coverage minimum: 80%

### Backend Testing
- Use pytest for unit tests
- Use pytest-asyncio for async tests
- Integration tests for API endpoints
- Test coverage minimum: 85%

## Code Review Guidelines

### What to Look For
- Code functionality
- Code style
- Performance implications
- Security considerations
- Test coverage
- Documentation

### Review Process
1. Read the description
2. Check out the branch
3. Run the code
4. Review the changes
5. Provide constructive feedback
6. Approve or request changes

## Documentation

### Code Documentation
- Use JSDoc for TypeScript/JavaScript
- Use docstrings for Python
- Document complex algorithms
- Keep README files updated
- Document API endpoints

### API Documentation
- Use FastAPI automatic documentation
- Keep OpenAPI spec updated
- Document request/response formats
- Include example requests
- Document error responses

## Performance Guidelines

### Frontend Performance
- Implement code splitting
- Use lazy loading
- Optimize images
- Minimize bundle size
- Use proper caching
- Implement memoization

### Backend Performance
- Use async operations
- Implement proper caching
- Optimize database queries
- Use connection pooling
- Monitor response times

## Security Guidelines

### Frontend Security
- Sanitize user input
- Implement proper authentication
- Use HTTPS
- Follow OWASP guidelines
- Protect against XSS

### Backend Security
- Validate all input
- Use proper authentication
- Implement rate limiting
- Follow security best practices
- Regular security audits

## Deployment Process

### Development
1. Develop locally
2. Run tests
3. Create pull request
4. Review and merge

### Staging
1. Automatic deployment to Vercel preview
2. Run integration tests
3. Manual QA testing
4. Verify functionality

### Production
1. Merge to main branch
2. Automatic deployment
3. Verify deployment
4. Monitor for issues

## Monitoring and Debugging

### Frontend Monitoring
- Use Vercel Analytics
- Implement error tracking
- Monitor performance
- Track user behavior
- Log important events

### Backend Monitoring
- Use Vercel logs
- Monitor API performance
- Track error rates
- Monitor resource usage
- Set up alerts

## Best Practices

### State Management
- Use Zustand for global state
- Keep state minimal
- Use local state when possible
- Implement proper data flow
- Handle loading states

### Error Handling
- Implement proper error boundaries
- Use try-catch blocks
- Log errors appropriately
- Show user-friendly messages
- Handle edge cases

### API Design
- Follow REST principles
- Use proper HTTP methods
- Implement proper validation
- Version your APIs
- Document all endpoints

## Frontend Architecture

### Mantine UI Components

#### Theme Configuration
```typescript
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    // Custom color palette
  },
  shadows: {
    // Custom shadows
  },
  fontFamily: 'Inter, sans-serif',
});

export function ThemeProvider({ children }) {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
}
```

#### Common Components
- Use `@mantine/core` for basic UI components
- Use `@mantine/hooks` for utility hooks
- Use `@mantine/form` for form handling
- Use `@mantine/notifications` for toast messages
- Use `@mantine/rich-text` for the blog editor

#### Custom Components
- Extend Mantine components using the `styles` prop
- Use the `className` prop for custom styling
- Follow Mantine's component composition patterns
- Implement proper responsive design
- Use Mantine's theme tokens

### Zustand State Management

#### Store Structure
```typescript
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BlogState {
  posts: Post[];
  drafts: Draft[];
  categories: Category[];
  tags: Tag[];
  filters: Filters;
  loading: boolean;
  error: Error | null;
  // Actions
  fetchPosts: () => Promise<void>;
  createPost: (post: PostInput) => Promise<void>;
  updatePost: (id: string, post: PostInput) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
}

export const useBlogStore = create<BlogState>()(
  devtools(
    persist(
      (set, get) => ({
        posts: [],
        drafts: [],
        categories: [],
        tags: [],
        filters: defaultFilters,
        loading: false,
        error: null,
        
        fetchPosts: async () => {
          set({ loading: true });
          try {
            const posts = await api.getPosts(get().filters);
            set({ posts, loading: false });
          } catch (error) {
            set({ error, loading: false });
          }
        },
        // Other actions...
      }),
      {
        name: 'blog-storage',
        partialize: (state) => ({
          drafts: state.drafts,
          filters: state.filters,
        }),
      }
    )
  )
);
```

#### Store Usage
```typescript
function BlogList() {
  const { posts, loading, error, fetchPosts } = useBlogStore();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {posts.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}
```

#### Store Best Practices
1. Keep stores small and focused
2. Use selectors for derived state
3. Implement proper error handling
4. Use middleware for side effects
5. Persist only necessary state
6. Use TypeScript for type safety
7. Follow immutable update patterns

### Blog Editor Implementation

#### Rich Text Editor Setup
```typescript
import { RichTextEditor } from '@mantine/rte';

function BlogEditor({ content, onChange }) {
  return (
    <RichTextEditor
      value={content}
      onChange={onChange}
      controls={[
        ['bold', 'italic', 'underline', 'strike'],
        ['h1', 'h2', 'h3'],
        ['unorderedList', 'orderedList'],
        ['link', 'image'],
        ['sup', 'sub'],
        ['alignLeft', 'alignCenter', 'alignRight'],
      ]}
      sticky={false}
      styles={{
        root: { border: '1px solid #eee' },
        toolbar: { borderBottom: '1px solid #eee' },
      }}
    />
  );
}
```

#### Editor Features
- Rich text formatting
- Image upload and management
- Markdown support
- Auto-save functionality
- Version history
- SEO optimization tools 