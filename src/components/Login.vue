<template>
  <div class="login-page">
    <div class="login-card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="logo" />
      <h2 class="titulo">Bienvenido a la Clínica Oftalmológica</h2>
      <h3 class="subtitulo">Iniciar sesión</h3>

      <form class="formulario">
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" placeholder="usuario@ejemplo.com" />

        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="••••••••" />

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #e3f2fd, #ffffff);
  overflow: hidden;
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

.subtitulo {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #333;
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
