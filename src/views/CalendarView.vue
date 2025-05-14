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
      <div v-for="day in daysInMonth" :key="day" class="calendar-day" @click="openDayModal(day)">
        <div class="day-number">{{ day }}</div>
        <ul class="appointments">
          <li v-for="appt in getAppointmentsForDay(day)" :key="appt.id">
            <span @click.stop="openAppointmentModal(appt)" style="cursor:pointer;">{{ formatTimeRange(appt.start, appt.duration) }} - {{ appt.name }}</span>
            <button @click.stop="removeAppointment(appt.id)">🗑️</button>
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
          <label>Duración (minutos)</label>
          <input type="number" v-model="newAppointment.duration" min="1" required />
          <label>Paciente</label>
          <input type="text" v-model="newAppointment.name" required />
          <div class="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" @click="showAddModal = false">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="showDayModal" class="modal-overlay">
      <div class="modal day-modal">
        <h3>Citas del {{ selectedDay }} de {{ monthNames[selectedMonth] }} de {{ selectedYear }}</h3>
        <ul class="appointments expanded">
          <li v-for="appt in getAppointmentsForDay(selectedDay)" :key="appt.id">
            <span @click.stop="openAppointmentModal(appt)" style="cursor:pointer;">{{ formatTimeRange(appt.start, appt.duration) }} - {{ appt.name }}</span>
            <button @click="removeAppointment(appt.id)">🗑️</button>
          </li>
          <li v-if="getAppointmentsForDay(selectedDay).length === 0" style="color:#888;">Sin citas para este día</li>
        </ul>
        <div class="modal-actions">
          <button @click="closeDayModal">Cerrar</button>
        </div>
      </div>
    </div>
    <div v-if="showAppointmentModal" class="modal-overlay">
      <div class="modal appointment-modal">
        <h3>Información de la cita</h3>
        <div v-if="selectedAppointment">
          <p><b>Paciente:</b> {{ selectedAppointment.name }}</p>
          <p><b>Hora:</b> {{ formatTimeRange(selectedAppointment.start, selectedAppointment.duration) }}</p>
          <p><b>ID Paciente:</b> {{ selectedAppointment.patient_id }}</p>
          <p><b>ID Cita:</b> {{ selectedAppointment.id }}</p>
          <p style="color:#888;">(Aquí irá más información en el futuro)</p>
        </div>
        <div class="modal-actions">
          <button @click="closeAppointmentModal">Cerrar</button>
        </div>
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
  // Ejemplo de datos iniciales adaptados a la estructura del backend
  { id: 1, patient_id: 1, name: 'Juan Pérez', start: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-13T09:00`, duration: 30 },
  { id: 2, patient_id: 2, name: 'Ana López', start: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-13T10:00`, duration: 45 },
  { id: 3, patient_id: 3, name: 'Carlos Ruiz', start: `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-15T11:30`, duration: 60 },
])

const showAddModal = ref(false)
const newAppointment = ref({ date: '', time: '', duration: 30, name: '', patient_id: null })

const selectedDay = ref(null)
const showDayModal = ref(false)

const selectedAppointment = ref(null)
const showAppointmentModal = ref(false)

function openDayModal(day) {
  selectedDay.value = day
  showDayModal.value = true
}
function closeDayModal() {
  showDayModal.value = false
  selectedDay.value = null
}

function openAppointmentModal(appt) {
  selectedAppointment.value = appt
  showAppointmentModal.value = true
}
function closeAppointmentModal() {
  showAppointmentModal.value = false
  selectedAppointment.value = null
}

function getAppointmentsForDay(day) {
  const dayStr = `${selectedYear.value}-${String(selectedMonth.value+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return appointments.value.filter(a => a.start.startsWith(dayStr))
}

function formatTimeRange(startStr, duration) {
  const start = new Date(startStr)
  const end = new Date(start.getTime() + duration * 60000)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`
}

function addAppointment() {
  const id = Date.now()
  const start = `${newAppointment.value.date}T${newAppointment.value.time}`
  appointments.value.push({
    id,
    patient_id: newAppointment.value.patient_id || id, // Simulación
    name: newAppointment.value.name,
    start,
    duration: Number(newAppointment.value.duration)
  })
  showAddModal.value = false
  newAppointment.value = { date: '', time: '', duration: 30, name: '', patient_id: null }
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
  background: #f7fafc;
  border-radius: 1.1rem;
  box-shadow: 0 4px 24px rgba(25, 118, 210, 0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  border: 1px solid #e3f2fd;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0 1.5px 6px rgba(25,118,210,0.06);
  padding: 1.1rem 1.3rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.calendar-header h2 {
  margin: 0;
  color: #1976d2;
  font-size: 2rem;
  flex-shrink: 0;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-shadow: none;
}
.calendar-header button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.08rem;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1.5px 6px rgba(25,118,210,0.08);
  transition: background 0.2s;
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
  width: 250px;
  height: 120px;
  padding: 0.7rem 0.5rem 0.5rem 0.5rem;
  position: relative;
  color: #111;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
  max-height: 220px;
  box-shadow: 0 1.5px 6px rgba(25,118,210,0.06);
  border: none;
  transition: box-shadow 0.2s;
}
.calendar-day:hover {
  box-shadow: 0 4px 16px rgba(25,118,210,0.10);
  cursor: pointer;
}
.appointments {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.appointments li {
  background: #fff;
  border-radius: 0.5rem;
  margin-bottom: 0.3rem;
  padding: 0.3rem 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  box-shadow: 0 1px 4px rgba(25,118,210,0.04);
  color: #111;
  width: 100%;
  word-break: break-word;
  border-left: 3px solid #1976d2;
  transition: box-shadow 0.2s;
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
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  transition: background 0.2s;
}
.appointments button:hover {
  background: #ffeaea;
}
.day-number {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 0.3rem;
  font-size: 1.08rem;
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
.modal label {
  color: #222;
  font-weight: 500;
  margin-top: 0.7rem;
  margin-bottom: 0.2rem;
  display: block;
}
.modal input[type="date"],
.modal input[type="time"],
.modal input[type="number"],
.modal input[type="text"] {
  color: #222;
  background: #f5f5f5;
  border: 1px solid #b0b0b0;
  border-radius: 0.4rem;
  padding: 0.4rem 0.7rem;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 0.7rem;
}
.modal input::placeholder {
  color: #888;
  opacity: 1;
}
.modal h3 {
  color: #1976d2;
  margin-bottom: 1rem;
}
.day-modal {
  min-width: 350px;
  max-width: 98vw;
  width: 420px;
  padding: 2.5rem 2rem 2rem 2rem;
  background: #e3f2fd;
}
.appointments.expanded li {
  font-size: 0.95rem;
  padding: 0.4rem 0.7rem;
}
.appointments.expanded {
  margin-bottom: 1.2rem;
}
.appointment-modal {
  min-width: 320px;
  max-width: 95vw;
  width: 370px;
  padding: 2.2rem 1.7rem 1.7rem 1.7rem;
  background: linear-gradient(135deg, #e3f2fd 60%, #fffbe7 100%);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18), 0 1.5px 8px rgba(0,0,0,0.10);
  border: 1.5px solid #b6d4fa;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.appointment-modal h3 {
  color: #1976d2;
  margin-bottom: 1.2rem;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(25,118,210,0.08);
}
.appointment-modal p {
  margin: 0.7rem 0 0.7rem 0;
  color: #222;
  font-size: 1.13rem;
  background: #fff;
  border-radius: 0.6rem;
  box-shadow: 0 2px 8px rgba(25,118,210,0.07);
  padding: 0.7rem 1rem;
  width: 100%;
  border-left: 4px solid #1976d2;
}
.appointment-modal p:last-child {
  background: none;
  box-shadow: none;
  border: none;
  color: #888;
  padding-left: 0;
}
.appointment-modal .modal-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
.appointment-modal button {
  background: linear-gradient(90deg, #1976d2 60%, #64b5f6 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.08rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(25,118,210,0.10);
  transition: background 0.2s;
}
.appointment-modal button:hover {
  background: linear-gradient(90deg, #125ea7 60%, #42a5f5 100%);
}
@media (max-width: 900px) {
  .calendar-page {
    padding: 0.5rem;
  }
  .calendar-day {
    width: 60px;
    height: 100px;
  }
}
</style>
