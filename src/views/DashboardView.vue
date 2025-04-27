<template>
  <div class="dashboard">
    <div class="search-bar">
      <input type="text" placeholder="Buscar paciente..." />
    </div>

    <div class="quick-actions">
      <button @click="calendarRedirect">Calendario</button>
      <button @click="consultRedirect">Consultas</button>
    </div>
    <div class="section-wrapper">
      <div class="section">
        <h2>Citas de Hoy</h2>
        <ul>
          <li v-for="appt in todaysAppointments" :key="appt.id" @click="patientRedirect(appt.id)">
            {{ appt.time }} - {{ appt.patient }} ({{ appt.reason }})
          </li>
        </ul>
      </div>

      <div class="section">
        <h2>Exámenes Pendientes</h2>
        <ul>
          <li v-for="exam in recentExams" :key="exam.id" @click="examRedirect(exam.id)">
            {{ exam.date }} - {{ exam.patient }} ({{ exam.type }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const todaysAppointments = [
  { id: 1, time: '08:30', patient: 'Carlos M.', reason: 'Consulta general' },
  { id: 2, time: '09:15', patient: 'Ana R.', reason: 'Revisión de resultados' },
  { id: 3, time: '10:00', patient: 'Luis G.', reason: 'Dolor abdominal' },
  { id: 4, time: '10:45', patient: 'Sofía T.', reason: 'Consulta pediátrica' },
  { id: 5, time: '11:30', patient: 'José A.', reason: 'Control de presión' },
  { id: 6, time: '13:00', patient: 'Camila D.', reason: 'Chequeo anual' },
  { id: 7, time: '14:15', patient: 'Mario P.', reason: 'Dolor de cabeza' },
  { id: 8, time: '15:00', patient: 'Lucía V.', reason: 'Vacunación' },
  { id: 9, time: '16:00', patient: 'Daniel K.', reason: 'Consulta general' },
  { id: 10, time: '16:45', patient: 'Elena Z.', reason: 'Lesión en la pierna' },
  { id: 11, time: '08:45', patient: 'Felipe R.', reason: 'Revisión dental' },
  { id: 12, time: '09:30', patient: 'Marta P.', reason: 'Consulta oftalmológica' },
  { id: 13, time: '10:15', patient: 'Juan S.', reason: 'Chequeo de rutina' },
  { id: 14, time: '11:00', patient: 'Paola G.', reason: 'Control de diabetes' },
  { id: 15, time: '11:45', patient: 'Samuel F.', reason: 'Examen físico' },
  { id: 16, time: '12:30', patient: 'Raquel H.', reason: 'Chequeo cardiológico' },
  { id: 17, time: '13:45', patient: 'Nina L.', reason: 'Chequeo ginecológico' },
  { id: 18, time: '14:30', patient: 'Oscar J.', reason: 'Consulta de urgencias' },
  { id: 19, time: '15:15', patient: 'José M.', reason: 'Rehabilitación física' },
  { id: 20, time: '16:00', patient: 'Laura T.', reason: 'Chequeo preventivo' },
]

const recentExams = [
  { id: 1, date: '2025-04-22', patient: 'Luis G.', type: 'Rayos X' },
  { id: 2, date: '2025-04-21', patient: 'María F.', type: 'Examen de sangre' },
  { id: 3, date: '2025-04-20', patient: 'Carlos M.', type: 'Electrocardiograma' },
  { id: 4, date: '2025-04-19', patient: 'Ana R.', type: 'Tomografía' },
  { id: 5, date: '2025-04-18', patient: 'Mario P.', type: 'Análisis de orina' },
  { id: 6, date: '2025-04-18', patient: 'Sofía T.', type: 'Ultrasonido' },
  { id: 7, date: '2025-04-17', patient: 'Daniel K.', type: 'Rayos X' },
  { id: 8, date: '2025-04-17', patient: 'José A.', type: 'Resonancia magnética' },
  { id: 9, date: '2025-04-16', patient: 'Camila D.', type: 'Examen de sangre' },
  { id: 10, date: '2025-04-15', patient: 'Elena Z.', type: 'Tomografía' },
  { id: 11, date: '2025-04-14', patient: 'Felipe R.', type: 'Electrocardiograma' },
  { id: 12, date: '2025-04-13', patient: 'Marta P.', type: 'Tomografía' },
  { id: 13, date: '2025-04-12', patient: 'Juan S.', type: 'Análisis de orina' },
  { id: 14, date: '2025-04-11', patient: 'Paola G.', type: 'Rayos X' },
  { id: 15, date: '2025-04-10', patient: 'Samuel F.', type: 'Resonancia magnética' },
  { id: 16, date: '2025-04-09', patient: 'Raquel H.', type: 'Examen de sangre' },
  { id: 17, date: '2025-04-08', patient: 'Nina L.', type: 'Ultrasonido' },
  { id: 18, date: '2025-04-07', patient: 'Oscar J.', type: 'Electrocardiograma' },
  { id: 19, date: '2025-04-06', patient: 'José M.', type: 'Tomografía' },
  { id: 20, date: '2025-04-05', patient: 'Laura T.', type: 'Rayos X' },
]

const upcomingAvailability = [
  { date: '2025-04-23', slots: 4 },
  { date: '2025-04-24', slots: 2 },
  { date: '2025-04-25', slots: 6 },
]

function calendarRedirect() {
  alert('Redirigir a calendario...')
}

function consultRedirect() {
  alert('Redirigir a consultas...')
}

function patientRedirect(patientId) {
  alert(`Redirigir a pagina del paciente con ID ${patientId}`)
}

function examRedirect(examId) {
  alert(`Redirigir a la pagina del examen con ID ${examId})`)
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  color: var(--color-text);
}

.search-bar {
  margin-bottom: 1rem;
  text-align: center;
}

.search-bar input {
  width: 100%;
  max-width: 800px;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.quick-actions button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: var(--vt-c-indigo);
  color: white;
  cursor: pointer;
}

.quick-actions button:hover {
  background-color: #1f2e40;
}
.section-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-background-soft);
  overflow: auto;
  width: 500px;
}

.section h2 {
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.section ul {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  max-height: 60dvh;
  overflow-y: auto;
}

.section li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.section li:hover {
  background-color: var(--color-background);
}
</style>
