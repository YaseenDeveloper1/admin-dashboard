import { defineStore } from "pinia";
import axios from "axios";
export const useAuthStore = defineStore("auth:",{
    state: () => ({
        user: null,
        token:null,
        isAuthenticated: false
    }), 
    actions:{
        async login(username, password) {
            try {
                const response = await axios.post('https://dummyjson.com/auth/login', {
                    username,
                    password,
                    headers: { 'Content-Type': 'application/json' }
                });
                this.token = response.data.token;
                this.user = response.data.user;  // storing data in pinia store
                this.isAuthenticated = true;
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
        }
    }
})