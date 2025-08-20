<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="auth-logo" />
      <h2 class="auth-title">Iniciar Sesión</h2>

      <AuthForm :onSubmit="handleLogin" buttonText="Iniciar sesión">
        <AuthInput
          id="username"
          label="Nombre de Usuario"
          type="text"
          placeholder="Usuario"
          v-model="username"
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
import { login } from '@/services/authService'
import AuthForm from '@/components/Auth/AuthForm.vue'
import AuthInput from '@/components/Auth/AuthInput.vue'
import '@/assets/styles/auth.css'
import { useAuthStore } from '@/stores/auth'
const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    const response = await login(username.value, password.value)
    const authStore = useAuthStore()

    authStore.setAuth(response.token, response.user)
    window.location.href = '/dashboard'
  } catch (err) {
    error.value = err.message
  }
}
</script>
