import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure auth header for protected requests
export const configureAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authApi = {
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);  // FastAPI OAuth expects 'username'
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData, {
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
    const response = await api.post('/register', {
      email,
      password,
    });
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await api.post('/forgot-password', {
      email,
    });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },
}; 