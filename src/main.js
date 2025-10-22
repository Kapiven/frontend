import './assets/main.css'
import './assets/styles/patientpage.css'
import './styles/responsive.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// Comment for Workflow V2
const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// Initialize auth store after pinia is set up
const authStore = useAuthStore()
authStore.initializeAuth()

app.use(router)

app.mount('#app')
