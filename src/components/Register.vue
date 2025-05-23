<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="auth-logo" />
      <h2 class="auth-title">Registrarse</h2>
      <h3 class="auth-subtitle">Crea una cuenta</h3>

      <form class="auth-form" @submit.prevent="handleRegister">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" v-model="email" placeholder="usuario@ejemplo.com" />

        <label for="username">Usuario</label>
        <input type="text" id="username" v-model="username" placeholder="Asigna un nombre de usuario"/>

        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" placeholder="••••••••" />

        <button type="submit" class="auth-button">Registrarse</button>
      </form>

      <div class="auth-link">
        ¿Ya tienes cuenta?
        <router-link to="/">Inicia sesión aquí</router-link>
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>
      <p v-if="success" class="auth-success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '@/services/authService'
import '@/assets/styles/auth.css'

const email = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  try {
    error.value = ''
    success.value = ''
    const message = await register(email.value, username.value, password.value)
    success.value = message
  } catch (err) {
    error.value = err.message
  }
}
</script>