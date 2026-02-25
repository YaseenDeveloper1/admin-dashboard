import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),
  actions: {
    async login(username, password) {
      try {
        const url = import.meta.env.DEV ? '/api/auth/login' : 'https://dummyjson.com/auth/login'
        const response = await axios.post(url, {
          username,
          password
        });
        // DummyJSON returns user data + accessToken directly in response (not nested)
        const { accessToken, refreshToken, ...userData } = response.data;
        this.token = accessToken;
        this.user = userData;
        this.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});