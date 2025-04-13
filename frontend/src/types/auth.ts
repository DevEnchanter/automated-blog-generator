import { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordReset {
    token: string;
    new_password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<{ message: string; token?: string }>;
    resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>;
} 