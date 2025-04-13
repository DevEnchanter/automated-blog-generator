import { api } from './api';

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
    author: string;
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
        const response = await api.post<BlogPost>('/api/blogs', blog);
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
        const response = await api.get<BlogListResponse>('/api/blogs/me', {
            params: { page, limit }
        });
        return response.data;
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