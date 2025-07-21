import './assets/main.css'
import './assets/styles/patientpage.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Comment for Workflow V2
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
