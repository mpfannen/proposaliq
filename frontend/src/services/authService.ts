import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authService = {
  /**
   * Registers a new user account and stores the returned JWT in localStorage.
   * @param data - Registration payload: name, email, password, and optional reCAPTCHA token.
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Authenticates the user and stores the returned JWT in localStorage.
   * @param credentials - The user's email and password.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /** Removes the JWT and user data from localStorage, effectively logging out. */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /** Returns the cached user object from localStorage, or null if not logged in. */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  /** Returns the stored JWT string, or null if not logged in. */
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update name/email
  updateProfile: async (data: { name?: string; email?: string }) => {
    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await axios.put(`${API_URL}/api/auth/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Sends a password reset email to the given address.
   * Always returns success to prevent email enumeration.
   */
  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    return response.data;
  },

  /**
   * Resets the user's password using a valid, unexpired reset token.
   * @param token - The token extracted from the reset link URL.
   * @param password - The new password (min 8 characters).
   */
  resetPassword: async (token: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, { token, password });
    return response.data;
  },

  /**
   * Changes the authenticated user's password.
   * @param currentPassword - Must match the current password on record.
   * @param newPassword - The replacement password (min 8 characters).
   */
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await axios.put(
      `${API_URL}/api/auth/password`,
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default authService;
