import { api } from './api';
import { v4 as uuidv4 } from 'uuid';

export interface BlogGenerationParams {
    topic: string;
    tone: string;
    length: string;
    target_audience: string;
    keywords: string[];
}

export interface BlogGenerationResponse {
    content: string;
    title: string;
    meta_description: string;
    estimated_read_time: number;
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    author_id: string;
    status: 'draft' | 'published';
    views: number;
    created_at: string;
    updated_at: string;
    meta_description: string;
    tags: string[];
    estimated_read_time: number;
    slug: string;
}

export interface BlogListResponse {
    data: BlogPost[];
    total: number;
    page: number;
    limit: number;
}

export const generateBlog = async (params: BlogGenerationParams): Promise<BlogGenerationResponse> => {
    try {
        const response = await api.post<BlogGenerationResponse>('/api/blogs/generate', params, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.detail || 'Failed to generate blog post');
        }
        throw new Error('Network error occurred while generating blog post');
    }
};

export const blogService = {
    async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
        // Format the blog post data
        const formattedBlog = {
            title: blog.title || '',
            content: blog.content || '',
            author_id: 'current-user', // TODO: Get from auth context
            status: 'draft',
            views: 0,
            meta_description: blog.meta_description || '',
            tags: blog.tags || [],
            estimated_read_time: blog.estimated_read_time || 0,
            slug: blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        };

        const response = await api.post<BlogPost>('/api/blogs', formattedBlog);
        return response.data;
    },

    async getBlog(id: string): Promise<BlogPost> {
        const response = await api.get<BlogPost>(`/api/blogs/${id}`);
        return response.data;
    },

    async getBlogBySlug(slug: string): Promise<BlogPost> {
        const response = await api.get<BlogPost>(`/api/blogs/slug/${slug}`);
        return response.data;
    },

    async getMyBlogs(page: number = 1, limit: number = 10): Promise<BlogListResponse> {
        const response = await api.get<BlogPost[]>('/api/blogs', {
            params: { 
                page, 
                limit,
                author_id: 'current-user' // Add author_id filter
            }
        });
        return {
            data: response.data,
            total: response.data.length,
            page,
            limit
        };
    },

    async getAllBlogs(page: number = 1, limit: number = 10): Promise<BlogListResponse> {
        const response = await api.get<BlogListResponse>('/api/blogs', {
            params: { page, limit }
        });
        return response.data;
    },

    async updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
        const response = await api.put<BlogPost>(`/api/blogs/${id}`, updates);
        return response.data;
    },

    async deleteBlog(id: string): Promise<void> {
        await api.delete(`/api/blogs/${id}`);
    },

    async publishBlog(id: string): Promise<BlogPost> {
        const response = await api.post<BlogPost>(`/api/blogs/${id}/publish`);
        return response.data;
    },

    async unpublishBlog(id: string): Promise<BlogPost> {
        const response = await api.post<BlogPost>(`/api/blogs/${id}/unpublish`);
        return response.data;
    }
}; 