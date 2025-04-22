<template>
  <div class="login-page">
    <div class="login-card">
      <h2>Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" v-model="email" placeholder="usuario@ejemplo.com" />

        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" placeholder="••••••••" />

        <button type="submit">Iniciar sesión</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '@/services/authService';

const email = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
  try {
    error.value = '';
    const token = await login(email.value, password.value);
    console.log('Token recibido:', token);

    // Redirigir al usuario a otra página (por ejemplo, el dashboard)
    window.location.href = '/dashboard';
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<style scoped>
/* Estilos existentes */
</style>