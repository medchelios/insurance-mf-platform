import { authApi } from './api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  async login(email, password) {
    const data = await authApi.login(email, password);
    return data.user;
  },

  async register(name, email, password, passwordConfirmation) {
    const data = await authApi.register(name, email, password, passwordConfirmation);
    return data.user;
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};