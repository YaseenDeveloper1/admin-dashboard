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
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

      <input v-model="username" placeholder="Username" class="w-full mb-4 p-2 border rounded"/>
      <input v-model="password" type="password" placeholder="Password" class="w-full mb-4 p-2 border rounded"/>

      <button @click="handleLogin" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Login
      </button>

      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
      <p class="text-gray-500 text-sm mt-4 text-center">Demo: emilys / emilyspass</p>
    </div>
  </div>
</template>