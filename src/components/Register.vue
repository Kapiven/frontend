<template>
    <div class="register-page">
      <div class="register-card">
        <h2>Registro</h2>
        <form @submit.prevent="handleRegister">
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
  import { ref } from 'vue';
  import { register } from '@/services/authService';
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  const success = ref('');
  
  async function handleRegister() {
    try {
      error.value = '';
      success.value = '';
      const message = await register(email.value, password.value);
      success.value = message;
    } catch (err) {
      error.value = err.message;
    }
  }
  </script>
  
  <style scoped>
  /* Estilos básicos */
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .register-card {
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>