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
  <nav class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
    
    <div>
      <h2 class="text-lg font-semibold">
       Welcome {{ auth.user?.firstName }} 
      </h2>
    </div>

    <button
      @click="handleLogout"
      class="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>

  </nav>
</template>