<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const usersStore = useUsersStore()
const router = useRouter()
const showUserDropdown = ref(false)
const imageLoadError = ref(false)

const userImageUrl = computed(() => {
  if (auth.user?.image && !imageLoadError.value) return auth.user.image
  const name = `${auth.user?.firstName || ''} ${auth.user?.lastName || 'User'}`.trim()
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
})

const onImageError = () => {
  imageLoadError.value = true
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleLogout = () => {
  showUserDropdown.value = false
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="px-6 py-4 flex items-center justify-between">
    <h1 class="text-xl font-semibold">User List</h1>
    
    <div class="flex-1 max-w-md mx-4">
      <div class="relative">
        <input
          v-model="usersStore.searchQuery"
          type="text"
          placeholder="Q Search..."
          class="w-full px-2 py-2 pl-10  border rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
      </div>
    </div>

    <div class="flex items-center gap-2">
    

      <div class="relative ml-2">
        <button
          @click="toggleUserDropdown"
          class="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
        >
          <img
            :src="userImageUrl"
            :alt="auth.user?.firstName"
            class="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
            @error="onImageError"
          />
        </button>
        <div
          v-if="showUserDropdown"
          class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[60]"
        >
          <div class="px-4 py-2 border-b border-slate-100">
            <p class="text-sm font-medium text-slate-800">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
            <p class="text-xs text-slate-500">{{ auth.user?.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div v-if="showUserDropdown" @click="showUserDropdown = false" class="fixed inset-0 z-[55]"></div>
</template>
