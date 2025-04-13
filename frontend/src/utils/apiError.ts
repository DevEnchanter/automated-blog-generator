import { AxiosError } from 'axios';

interface ErrorResponse {
    message?: string;
    code?: string;
    details?: any;
}

export class ApiError extends Error {
    status: number;
    code: string;
    details: any;

    constructor(error: AxiosError) {
        const response = error.response?.data as ErrorResponse || {};
        super(response.message || error.message);
        this.name = 'ApiError';
        this.status = error.response?.status || 500;
        this.code = response.code || 'UNKNOWN_ERROR';
        this.details = response.details || {};
    }
}

export const handleApiError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        throw new ApiError(error);
    }
    throw error;
};

export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};

export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}; 