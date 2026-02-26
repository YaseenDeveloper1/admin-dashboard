import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = 'https://dummyjson.com/users'
// DummyJSON only has users 1-208. Locally added users get id 209+ and don't exist on their server
const MAX_REAL_USER_ID = 208

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    searchQuery: '' // Shared between Navbar and Dashboard
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(API_BASE)
        this.users = response.data.users
      } catch (err) {
        this.error = 'Failed to fetch users'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
           // Add New User, I simulate it locally since DummyJSON does not support adding users.    Create in CRUD
    async addUser(userData) {
      this.error = null
      try {
        const response = await axios.post(`${API_BASE}/add`, userData)
        this.users = [response.data, ...this.users]
        return { success: true, user: response.data }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add user'
        console.error(err)
        return { success: false }
      }
    },
// EDIT USER.  Update in CRUD
    async updateUser(id, userData) {
      this.error = null
      const numId = Number(id)
      const isLocalUser = numId > MAX_REAL_USER_ID

      try {
        if (isLocalUser) {
          const index = this.users.findIndex(u => u.id === numId || u.id === id)
          if (index !== -1) {
            this.users[index] = { ...this.users[index], ...userData }
          }
          return { success: true, user: this.users.find(u => u.id === numId || u.id === id) }
        }
        const response = await axios.put(`${API_BASE}/${id}`, userData)
        const index = this.users.findIndex(u => u.id === id || u.id === numId)
        if (index !== -1) this.users[index] = { ...this.users[index], ...response.data }
        return { success: true, user: response.data }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update user'
        console.error(err)
        return { success: false }
      }
    },

    async deleteUser(id) {
      this.error = null
      const numId = Number(id)
      const isLocalUser = numId > MAX_REAL_USER_ID

      try {
        if (!isLocalUser) {
          await axios.delete(`${API_BASE}/${id}`)
        }
        this.users = this.users.filter(u => u.id !== id && u.id !== numId)
        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete user'
        console.error(err)
        return { success: false }
      }
    }
  }
})