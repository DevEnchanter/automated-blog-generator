import axios from 'axios';
import { useAuthStore } from '../store/auth';

const API_URL = 'http://localhost:8000';

export interface BlogGenerationParams {
    title: string;
    topic: string;
    keywords: string;
    tone: string;
    length: string;
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

export const blogService = {
    async generateContent(params: BlogGenerationParams): Promise<string> {
        const token = useAuthStore.getState().token;
        const response = await axios.post(`${API_URL}/blog/generate`, params, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.content;
    },

    async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
        const token = useAuthStore.getState().token;
        const response = await axios.post(`${API_URL}/blog`, blog, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async getBlog(id: string): Promise<BlogPost> {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${API_URL}/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async getMyBlogs(): Promise<BlogPost[]> {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${API_URL}/blogs`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
        const token = useAuthStore.getState().token;
        const response = await axios.put(`${API_URL}/blog/${id}`, updates, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async deleteBlog(id: string): Promise<void> {
        const token = useAuthStore.getState().token;
        await axios.delete(`${API_URL}/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}; 