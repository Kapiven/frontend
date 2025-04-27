<template>
  <div class="login-page">
    <div class="login-card">
      <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
      <h2 class="titulo">Iniciar Sesion</h2>

      <form @submit.prevent="handleLogin" class="formulario">
        <label for="email">Correo Electronico</label>
        <input type="email" id="email" v-model="email" placeholder="usuario@ejemplo.com" />

        <label for="password">Contrasena</label>
        <input type="password" id="password" v-model="password" placeholder="********" />

        <button type="submit">Iniciar Sesion</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/services/authService'

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    const token = await login(email.value, password.value)
    console.log('Token recibido:', token)

    // Redirigir al usuario a otra página (por ejemplo, el dashboard)
    window.location.href = '/dashboard'
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #e3f2fd, #ffffff);
}

.login-card {
  background-color: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  width: 80px;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.3rem;
  color: #1976d2;
  margin-bottom: 0.5rem;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.formulario label {
  font-size: 0.9rem;
  color: #444;
}

.formulario input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.formulario button {
  margin-top: 1rem;
  padding: 0.7rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.formulario button:hover {
  background-color: #125ea7;
}
</style>
