<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <h2>Calendario de Citas</h2>
      <div class="header-actions">
        <div class="month-year-select">
          <select v-model="selectedMonth">
            <option v-for="(m, idx) in monthNames" :key="m" :value="idx">{{ m }}</option>
          </select>
          <select v-model="selectedYear">
            <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <button @click="showAddModal = true">+ Nueva Cita</button>
      </div>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysInMonth" :key="day" class="calendar-day">
        <div class="day-number">{{ day }}</div>
        <ul class="appointments">
          <li v-for="appt in getAppointmentsForDay(day)" :key="appt.id">
            <span>{{ appt.time }} - {{ appt.patient }}</span>
            <button @click="removeAppointment(appt.id)">🗑️</button>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <h3>Nueva Cita</h3>
        <form @submit.prevent="addAppointment">
          <label>Fecha</label>
          <input type="date" v-model="newAppointment.date" required />
          <label>Hora</label>
          <input type="time" v-model="newAppointment.time" required />
          <label>Paciente</label>
          <input type="text" v-model="newAppointment.patient" required />
          <div class="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" @click="showAddModal = false">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()

const selectedYear = ref(currentYear)
const selectedMonth = ref(currentMonth)

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const yearRange = computed(() => {
  const years = []
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    years.push(y)
  }
  return years
})

const daysInMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
})

const appointments = ref([
  // Ejemplo de datos iniciales
  { id: 1, date: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-13`, time: '09:00', patient: 'Juan Pérez' },
  { id: 2, date: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-15`, time: '11:30', patient: 'Ana López' },
])

const showAddModal = ref(false)
const newAppointment = ref({ date: '', time: '', patient: '' })

function getAppointmentsForDay(day) {
  const dayStr = `${selectedYear.value}-${String(selectedMonth.value+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return appointments.value.filter(a => a.date === dayStr)
}

function addAppointment() {
  const id = Date.now()
  appointments.value.push({ id, ...newAppointment.value })
  showAddModal.value = false
  newAppointment.value = { date: '', time: '', patient: '' }
}

function removeAppointment(id) {
  appointments.value = appointments.value.filter(a => a.id !== id)
}
</script>

<style scoped>
.calendar-page {
  max-width: 98vw;
  min-width: 320px;
  width: 98vw;
  min-height: 85vh;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 2rem;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.calendar-header h2 {
  margin: 0;
  color: #111;
  font-size: 2.2rem;
  flex-shrink: 0;
}
.calendar-header button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.13rem;
  cursor: pointer;
  font-weight: 500;
}
.calendar-header button:hover {
  background: #125ea7;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}
.calendar-day {
  background: #e3f2fd;
  border-radius: 0.7rem;
  min-height: 140px;
  min-width: 90px;
  padding: 0.5rem;
  position: relative;
  color: #111;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.day-number {
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 0.3rem;
}
.appointments {
  list-style: none;
  padding: 0;
  margin: 0;
}
.appointments li {
  background: #fff;
  border-radius: 0.4rem;
  margin-bottom: 0.3rem;
  padding: 0.2rem 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  color: #111;
}
.appointments li span {
  color: #111;
}
.appointments button {
  background: none;
  border: none;
  color: #d32f2f;
  font-size: 1.1rem;
  cursor: pointer;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  min-width: 320px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.month-year-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.month-year-select select {
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  border: 1px solid #b0b0b0;
  font-size: 1rem;
  background: #f5f5f5;
  color: #222;
}
@media (max-width: 900px) {
  .calendar-page {
    padding: 0.5rem;
  }
  .calendar-day {
    min-width: 60px;
    min-height: 100px;
  }
}
</style>
