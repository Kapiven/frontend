<template>
  <div class="perfil-container">
    <h1 class="titulo">Perfil del Paciente</h1>

    <div v-if="cargando">Cargando datos del paciente...</div>
    <div v-else-if="paciente">
      <!-- Sección: Datos Personales -->
      <section class="seccion">
        <h2 class="subtitulo">Datos Personales</h2>
        <div class="grid">
          <div><strong>Nombre:</strong> {{ paciente.name }}</div>
          <div><strong>Fecha de nacimiento:</strong> {{ formatDate(paciente.date_of_birth) }}</div>
          <div><strong>Edad:</strong> {{ calcularEdad(paciente.date_of_birth) }} años</div>
          <div><strong>Teléfono:</strong> {{ paciente.phone }}</div>
        </div>
      </section>

      <!-- Sección: Antecedentes -->
      <section v-if="paciente.antecedentes" class="seccion">
        <h2 class="subtitulo">Antecedentes</h2>
        <div class="grid">
          <div><strong>Antecedentes médicos:</strong> {{ paciente.antecedentes.medical }}</div>
          <div><strong>Antecedentes familiares:</strong> {{ paciente.antecedentes.family }}</div>
          <div><strong>Antecedentes oculares:</strong> {{ paciente.antecedentes.ocular }}</div>
          <div><strong>Alergias:</strong> {{ paciente.antecedentes.alergic }}</div>
          <div><strong>Otros:</strong> {{ paciente.antecedentes.other }}</div>
        </div>
      </section>

      <!-- Acciones -->
      <div class="acciones">
        <button class="btn azul">Editar</button>
        <button class="btn gris">Historial</button>
        <button class="btn verde">Nueva Cita</button>
      </div>
    </div>
    <div v-else>
      <p>No se encontró el paciente.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PerfilPaciente',
  props: {
    pacienteId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      paciente: null,
      cargando: true,
    }
  },
  created() {
    this.obtenerDatosPaciente()
  },
  methods: {
    async obtenerDatosPaciente() {
      try {
        const res = await axios.get(`/api/pacientes/${this.pacienteId}`)
        this.paciente = res.data
      } catch (err) {
        console.error('Error al obtener paciente:', err)
      } finally {
        this.cargando = false
      }
    },
    formatDate(fechaISO) {
      const date = new Date(fechaISO)
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    calcularEdad(fechaISO) {
      const nacimiento = new Date(fechaISO)
      const hoy = new Date()
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const m = hoy.getMonth() - nacimiento.getMonth()
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
      }
      return edad
    },
  },
}
</script>

<style scoped>
.perfil-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.titulo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  color: #222;
}

.seccion {
  margin-bottom: 32px;
}

.subtitulo {
  font-size: 20px;
  margin-bottom: 16px;
  color: #444;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn.azul {
  background-color: #1976d2;
  color: #fff;
}

.btn.azul:hover {
  background-color: #1565c0;
}

.btn.gris {
  background-color: #e0e0e0;
  color: #333;
}

.btn.gris:hover {
  background-color: #d5d5d5;
}

.btn.verde {
  background-color: #1976d2;
  color: #fff;
}

.btn.verde:hover {
  background-color: #1565c0;
}
</style>
