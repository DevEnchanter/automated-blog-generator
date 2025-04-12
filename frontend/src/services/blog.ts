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
}

export const generateBlog = async (params: BlogGenerationParams): Promise<BlogGenerationResponse> => {
    const response = await api.post<BlogGenerationResponse>('/api/blogs/generate', params);
    return response.data;
};

export const blogService = {
    async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
        const response = await api.post<BlogPost>('/blog', blog);
        return response.data;
    },

    async getBlog(id: string): Promise<BlogPost> {
        const response = await api.get<BlogPost>(`/blog/${id}`);
        return response.data;
    },

    async getMyBlogs(): Promise<BlogPost[]> {
        const response = await api.get<BlogPost[]>('/blogs');
        return response.data;
    },

    async updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
        const response = await api.put<BlogPost>(`/blog/${id}`, updates);
        return response.data;
    },

    async deleteBlog(id: string): Promise<void> {
        await api.delete(`/blog/${id}`);
    }
}; 