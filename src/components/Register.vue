<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="auth-logo" />
      <h2 class="auth-title">Registrarse</h2>
      <h3 class="auth-subtitle">Crea una cuenta</h3>

      <AuthForm :onSubmit="handleRegister" buttonText="Registrarse">
        <AuthInput
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="usuario@ejemplo.com"
          v-model="email"
        />

        <AuthInput
          id="username"
          label="Usuario"
          type="text"
          placeholder="Asigna un nombre de usuario"
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
import AuthForm from '@/components/AuthForm.vue'
import AuthInput from '@/components/AuthInput.vue'
import '@/assets/styles/auth.css'

const email = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  error.value = ''
  success.value = ''
  try {
    const message = await register(email.value, username.value, password.value)
    success.value = message
  } catch (err) {
    error.value = err.message
  }
}
</script>