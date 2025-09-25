<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="auth-logo" />
      <h2 class="auth-title">Iniciar Sesión</h2>

      <AuthForm :onSubmit="handleLogin" buttonText="Iniciar sesión">
        <AuthInput
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="usuario@ejemplo.com"
          v-model="email"
        />

        <AuthInput
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          v-model="password"
        />
      </AuthForm>

      <div class="auth-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/authService'
import AuthForm from '@/components/Auth/AuthForm.vue'
import AuthInput from '@/components/Auth/AuthInput.vue'
import '@/assets/styles/auth.css'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    const response = await login(email.value, password.value)
    const authStore = useAuthStore()

    console.log('Login response:', response)
    
    // Ensure we have both token and user data
    if (!response.token) {
      throw new Error('Token no recibido del servidor')
    }

  authStore.setAuth(response.token, response.user || { email: email.value })
    
    // Use router instead of window.location for better navigation
    await router.push('/dashboard')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Error al iniciar sesión'
  }
}
</script>
