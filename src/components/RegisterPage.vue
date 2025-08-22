<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="auth-logo" />
      <h2 class="auth-title">Registro</h2>
      <form @submit.prevent="handleRegister">
        <div class="new-user-section">
          <h3 class="section-title">Datos</h3>
          <div class="form-group">
            <label for="new-user-name">Nombre completo</label>
            <input id="new-user-name" v-model="newUserName" type="text" placeholder="Nombre Apellido" required />
          </div>
          <div class="form-group">
            <label for="new-user-email">Correo electrónico</label>
            <input id="new-user-email" v-model="newUserEmail" type="email" placeholder="nuevo@clinica.com" required />
          </div>
          <div class="password-info">
            <p>La contraseña se generará automáticamente y se enviará al correo proporcionado.</p>
          </div>
        </div>
        <button class="auth-btn" type="submit">Registrar</button>
      </form>
      <div class="auth-link">
        <router-link to="/">Volver al inicio de sesión</router-link>
      </div>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <p v-if="success" class="auth-success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const adminUsername = ref('')
const adminPassword = ref('')
const newUserName = ref('')
const newUserEmail = ref('')
const error = ref('')
const success = ref('')

function handleRegister() {
  // Aquí iría la lógica de registro, pero solo mostramos la plantilla
  error.value = ''
  success.value = 'Registro simulado (plantilla)'
  newUserName.value = ''
  newUserEmail.value = ''
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f8fa;
}
.auth-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.08), 0 1.5px 8px rgba(0,0,0,0.06);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-logo {
  width: 80px;
  margin-bottom: 1.5rem;
  border-radius: 50%;
  object-fit: cover;
}
.auth-title {
  color: #1976d2;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}
.auth-subtitle {
  color: #222;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  text-align: center;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.section-title {
  font-size: 1rem;
  color: #1976d2;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: left;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.form-group label {
  font-size: 0.97rem;
  color: #222;
  margin-bottom: 0.3rem;
}
.form-group input {
  padding: 0.6rem 0.9rem;
  border: 1px solid #e3e8ee;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #222;
  outline: none;
  transition: border 0.2s;
}
.form-group input:focus {
  border: 1.5px solid #1976d2;
}
.auth-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.8rem 0;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
  width: 100%;
  transition: background 0.2s;
}
.auth-btn:hover {
  background-color: #1565c0;
}
.password-info {
  background-color: #f5f5f5;
  padding: 0.8rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}
.auth-link {
  margin-top: 1.5rem;
  text-align: center;
}
.auth-link a {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}
.auth-error {
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
}
.auth-success {
  color: #388e3c;
  margin-top: 1rem;
  text-align: center;
}
@media (max-width: 480px) {
  .auth-card {
    padding: 1.2rem 0.5rem;
    max-width: 98vw;
  }
  .auth-title {
    font-size: 1.3rem;
  }
  .auth-subtitle {
    font-size: 1rem;
  }
}
</style>
