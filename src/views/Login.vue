<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

// Inputs
const username = ref('') 
const password = ref('') 
const errorMessage = ref('')

// Pinia store
const auth = useAuthStore()
const router = useRouter()

// Login button click
const handleLogin = async () => {
  errorMessage.value = ''
  
  const success = await auth.login(username.value, password.value)
  
  if(success){
    router.push('/dashboard')
  } else {
    errorMessage.value = 'Invalid username or password'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4">
    <div class="relative w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
        <div class="text-center mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p class="text-slate-300 mt-2 text-sm">Sign in to continue</p>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-2">Username</label>
            <input
              v-model="username"
              placeholder="Enter username"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter password"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          @click="handleLogin"
          class="w-full mt-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-200"
        >
          Sign In
        </button>

        <p v-if="errorMessage" class="mt-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
          {{ errorMessage }}
        </p>
        <div class="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <p class="text-slate-400 text-xs font-medium mb-2">Demo credentials:</p>
          <p class="text-slate-300 text-xs">Emily: emilys / emilyspass</p>
          <p class="text-slate-300 text-xs">James: jamesd / jamesdpass</p>
          <p class="text-slate-300 text-xs">Michael: michaelw / michaelwpass</p>
        </div>
      </div>
    </div>
  </div>
</template>