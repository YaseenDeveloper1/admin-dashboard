import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia) // global state for storing users
app.use(router)  // Activate now for different pages
.mount('#app')
