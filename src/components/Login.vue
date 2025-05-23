<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="auth-logo" />
      <h2 class="auth-title">Iniciar Sesión</h2>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" placeholder="usuario@ejemplo.com" v-model="email" />

        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="••••••••" v-model="password" />

        <button type="submit" class="auth-button">Iniciar sesión</button>
      </form>

      <div class="auth-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { login } from '@/services/authService'
import '@/assets/styles/auth.css'

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    const token = await login(email.value, password.value)
    window.location.href = '/dashboard'
  } catch (err) {
    error.value = err.message
  }
}
</script>