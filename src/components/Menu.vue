<template>
  <div class="fondo">
    <div class="card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="logo" />
      <h1>Clínica Oftalmológica OPTYMA</h1>
      <p>Tu salud visual en buenas manos</p>

      <div class="botones">
        <button @click="iniciarSesion">Iniciar Sesión</button>
        <button @click="registrarse">Registrarse</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuPrincipal",
  methods: {
    iniciarSesion() {
      this.$router.push("/login");
    },
    registrarse() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.fondo {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #e0f2fe, #ffffff);
}

.card {
  background-color: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 350px;
  width: 100%;
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.8rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.botones button {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.botones button:first-child {
  background-color: #0284c7;
  color: white;
}

.botones button:first-child:hover {
  background-color: #0369a1;
}

.botones button:last-child {
  background-color: white;
  color: #0284c7;
  border: 2px solid #0284c7;
}

.botones button:last-child:hover {
  background-color: #e0f2fe;
}
</style>
