import { create } from 'zustand';
import { authApi, configureAuthHeader } from '../services/api';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<any>;
    resetPassword: (token: string, newPassword: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => {
    // Initialize auth header with stored token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        configureAuthHeader(storedToken);
    }

    return {
        token: storedToken,
        isAuthenticated: !!storedToken,
        
        login: async (email: string, password: string) => {
            try {
                const response = await authApi.login(email, password);
                const token = response.access_token;
                localStorage.setItem('token', token);
                set({ token, isAuthenticated: true });
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        
        register: async (email: string, password: string) => {
            try {
                const response = await authApi.register(email, password);
                const token = response.access_token;
                localStorage.setItem('token', token);
                set({ token, isAuthenticated: true });
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        },
        
        logout: () => {
            localStorage.removeItem('token');
            configureAuthHeader(null);
            set({ token: null, isAuthenticated: false });
        },

        requestPasswordReset: async (email: string) => {
            try {
                return await authApi.requestPasswordReset(email);
            } catch (error) {
                console.error('Password reset request failed:', error);
                throw error;
            }
        },

        resetPassword: async (token: string, newPassword: string) => {
            try {
                return await authApi.resetPassword(token, newPassword);
            } catch (error) {
                console.error('Password reset failed:', error);
                throw error;
            }
        }
    };
}); 