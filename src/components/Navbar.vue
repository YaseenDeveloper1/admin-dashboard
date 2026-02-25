<script setup>
import { useAuthStore } from '../stores/auth'

import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 shadow-lg">
    <div class="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <span class="text-indigo-400 font-bold text-lg">A</span>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-white">
            Welcome, <span class="text-indigo-400">{{ auth.user?.firstName || 'User' }}</span>
          </h2>
          <p class="text-slate-400 text-xs">Admin Dashboard</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 font-medium text-sm"
      >
        Logout
      </button>
    </div>
  </nav>
</template>