export interface User {
    email: string;
    disabled?: boolean;
}

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
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<{ message: string; token?: string }>;
    resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>;
} 