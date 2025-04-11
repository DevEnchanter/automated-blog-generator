import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authService } from '../services/auth';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            const { access_token } = response;
            
            localStorage.setItem('token', access_token);
            const user = await authService.getCurrentUser(access_token);
            
            set({ 
                user, 
                token: access_token, 
                isAuthenticated: true 
            });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    register: async (credentials: RegisterCredentials) => {
        try {
            await authService.register(credentials);
            await useAuthStore.getState().login({
                username: credentials.username,
                password: credentials.password
            });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
        });
    }
})); 