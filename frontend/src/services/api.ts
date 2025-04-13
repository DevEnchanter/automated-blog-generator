import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configure auth header for protected requests
export const configureAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Add retry logic for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const retryRequest = async (error: AxiosError, retryCount: number): Promise<any> => {
  if (retryCount >= MAX_RETRIES) {
    return Promise.reject(error);
  }

  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
  return api.request(error.config!);
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status && status >= 500) {
      return retryRequest(error, 0);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      configureAuthHeader(response.data.access_token);
    }
    
    return response.data;
  },

  async register(email: string, password: string) {
    const response = await api.post('/api/auth/register', {
      email,
      password,
    });
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await api.post('/api/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/api/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/api/auth/refresh-token');
    if (response.data.access_token) {
      configureAuthHeader(response.data.access_token);
    }
    return response.data;
  }
}; 