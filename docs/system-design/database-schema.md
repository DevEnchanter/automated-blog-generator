# Database Schema

## Users Collection
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
```

## Posts Collection
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  authorId: string;
  categoryIds: string[];
  tags: string[];
  seoMetadata: {
    description: string;
    keywords: string[];
  };
  publishedAt: Timestamp | null;
  scheduledFor: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  analytics: {
    views: number;
    likes: number;
    shares: number;
  };
}
```

## Categories Collection
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Analytics Collection
```typescript
interface Analytics {
  id: string;
  postId: string;
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  date: Timestamp;
}
``` 