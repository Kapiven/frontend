<template>
  <div class="register-page">
    <div class="register-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="logo" />
      <h2 class="titulo">Registrarse</h2>
      <h3 class="subtitulo">Crea una cuenta</h3>

      <form @submit.prevent="handleRegister" class="formulario">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" v-model="email" placeholder="usuario@ejemplo.com" />

        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" placeholder="••••••••" />

        <button type="submit">Registrarse</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '@/services/authService'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  try {
    error.value = ''
    success.value = ''
    const message = await register(email.value, password.value)
    success.value = message
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.register-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #e3f2fd, #ffffff);
}

.register-card {
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

.subtitulo {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #2e2d2d;
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

.error {
  margin-top: 1rem;
  color: red;
  font-size: 0.9rem;
}

.success {
  margin-top: 1rem;
  color: green;
  font-size: 0.9rem;
}
</style>


