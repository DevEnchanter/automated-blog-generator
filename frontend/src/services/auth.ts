import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:8000';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // FastAPI OAuth2 form expects 'username' field, but we use it for email
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);  // Using email as username
        formData.append('password', credentials.password);

        const response = await axios.post(`${API_URL}/token`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },

    async register(credentials: RegisterCredentials): Promise<void> {
        await axios.post(`${API_URL}/register`, credentials);
    },

    async getCurrentUser(token: string) {
        const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async requestPasswordReset(email: string): Promise<{ message: string; token?: string }> {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    },

    async resetPassword(token: string, new_password: string): Promise<{ message: string }> {
        const response = await axios.post(`${API_URL}/reset-password`, {
            token,
            new_password
        });
        return response.data;
    }
}; 