import { create } from 'zustand';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import app from '../lib/firebase';
import type { RegisterCredentials } from '../types/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
    const auth = getAuth(app);
    
    // Initialize auth state
    const user = auth.currentUser;
    set({ user, isAuthenticated: !!user });

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        set({ user, isAuthenticated: !!user });
    });

    return {
        user,
        isAuthenticated: !!user,
        
        login: async (email: string, password: string) => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        
        register: async (credentials: RegisterCredentials) => {
            try {
                await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        },
        
        logout: async () => {
            try {
                await signOut(auth);
            } catch (error) {
                console.error('Logout failed:', error);
                throw error;
            }
        }
    };
}); 