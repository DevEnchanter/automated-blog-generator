import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import app from '../lib/firebase';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

const auth = getAuth(app);

export const authService = {
    async login(credentials: LoginCredentials): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            return userCredential.user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    async register(credentials: RegisterCredentials): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            return userCredential.user;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },

    getCurrentUser(): User | null {
        return auth.currentUser;
    },

    onAuthStateChanged(callback: (user: User | null) => void) {
        return auth.onAuthStateChanged(callback);
    }
}; 