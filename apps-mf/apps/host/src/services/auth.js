const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const user = {
            email,
            name: email.split('@')[0],
            token: 'mock-token-' + Date.now()
          };
          localStorage.setItem(TOKEN_KEY, user.token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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