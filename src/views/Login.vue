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
  <div class="min-h-screen flex items-center justify-center bg-white">   
    <div class="relative w-full max-w-lg">
      <div class="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
        <div class="mb-8">
          <h1 class="text-2xl md:text-4xl font-bold tracking-tight">Login</h1>
          <h3 class="mt-3 text-lg">to get Started</h3>
        </div>

        <div class="space-y-5">
          <div>
            <!-- <label class="block text-sm font-medium mb-2">Username</label> -->
            <input
              v-model="username"
              placeholder="Demo: emilys "
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <!-- <label class="block text-slate-300 text-sm font-medium mb-2">Password</label> -->
            <input
              v-model="password"
              type="password"
              placeholder="Demo: emilyspass"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <h3 class="mt-2 text-md">Forgot Password?</h3>
        </div>

        <button
          @click="handleLogin"
          class="w-full mt-6 py-4 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-200"
        >
          Continue
        </button>

        <div class="text-center mt-6">
          <h1 class="text-lg text-md ">New User? <span class="font-bold">Register</span></h1>
        </div>

        <p v-if="errorMessage" class="mt-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
          {{ errorMessage }}
        </p>
        <!-- <div class="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <p class="text-slate-400 text-xs font-medium mb-2">Demo credentials:</p>
          <p class="text-slate-300 text-xs">Emily: emilys / emilyspass</p>
          <p class="text-slate-300 text-xs">James: jamesd / jamesdpass</p>
          <p class="text-slate-300 text-xs">Michael: michaelw / michaelwpass</p>
        </div> -->
      </div>
    </div>
  </div>
</template>