<template>
  <div class="fondo">
    <div class="card">
      <img src="@/assets/logo.jpg" alt="Logo de la clínica" class="logo" />
      <h1>Clínica Oftalmológica OPTYMA</h1>
      <p>Tu salud visual en buenas manos</p>

      <div class="botones">
        <button @click="iniciarSesion" class="btn btn-primary">Iniciar Sesión</button>
        <button @click="registrarse" class="btn btn-outline">Registrarse</button>
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
  background: var(--color-auth-gradient);
}

.card {
  background-color: var(--color-card-bg);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--shadow-large);
  text-align: center;
  max-width: 350px;
  width: 100%;
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 1rem;
  border-radius: 50%;
  object-fit: cover;
}

h1 {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

p {
  color: var(--color-text-secondary);
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
</style>