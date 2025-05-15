<template>
  <div class="dashboard">
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearchInput"
        placeholder="Buscar paciente..."
        autocomplete="off"
      />
      <ul v-if="showSuggestions" class="suggestions-list">
        <li v-for="patient in suggestions" :key="patient.id" @click="selectPatient(patient)">
          {{ patient.name }} ({{ patient.id }})
        </li>
        <li v-if="!suggestions.length && searchQuery.length >= 2" class="no-results">
          No se encontraron pacientes
        </li>
      </ul>
    </div>

    <div class="quick-actions">
      <button @click="calendarRedirect">Calendario</button>
      <button @click="consultRedirect">Consultas</button>
    </div>

    <div class="section-wrapper">
      <!-- Citas de Hoy (with free intervals) -->
      <div class="section">
        <h2>Citas de Hoy</h2>

        <ul>
          <template v-for="(item, idx) in todayIntervals" :key="idx">
            <li v-if="item.type === 'free'" class="interval-row free-interval">
              <span class="interval-time">
                {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
              </span>
              <span class="interval-label">Libre</span>
            </li>
            <li v-else class="interval-row appointment-item" @click="patientRedirect(item.appt.id)">
              <span class="interval-time">
                {{ formatTime(item.appt.start) }} - {{ formatTime(getApptEnd(item.appt)) }}
              </span>
              <span class="interval-label">{{ item.appt.name }}</span>
            </li>
          </template>
          <li v-if="todayIntervals.length === 0" class="no-appointments">
            No hay citas ni intervalos libres de 20+ minutos hoy
          </li>
        </ul>
      </div>

      <!-- Exámenes Pendientes -->
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { searchPatients } from '@/services/patientService'
import { getBusinessHoursForDay } from '@/services/businessHoursService'
import { getAppointmentsForDate } from '@/services/appointmentService'
import debounce from 'lodash.debounce'

const router = useRouter()
const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)

const businessHours = ref([])
const dayAppointments = ref([])

const todayStr = new Date().toISOString().slice(0, 10)

const fetchSuggestions = debounce(async (q) => {
  if (q.length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  const results = await searchPatients(q)
  suggestions.value = results
  showSuggestions.value = results.length > 0
}, 150)

function calendarRedirect() {
  router.push('/calendar')
}

function consultRedirect() {
  alert('Redirigir a consultas...')
}

function onSearchInput() {
  fetchSuggestions(searchQuery.value)
}

function selectPatient(patient) {
  searchQuery.value = patient.name
  showSuggestions.value = false
  patientRedirect(patient.id)
}

async function fetchDaySummary() {
  try {
    businessHours.value = await getBusinessHoursForDay(todayStr)
  } catch (e) {
    businessHours.value = []
  }
  try {
    dayAppointments.value = await getAppointmentsForDate(todayStr)
  } catch (e) {
    dayAppointments.value = []
  }
}

function handleClickOutside(event) {
  const searchBar = document.querySelector('.search-bar')
  if (searchBar && !searchBar.contains(event.target)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchDaySummary()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d)) return ''
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function getApptEnd(appt) {
  const start = new Date(appt.start)
  const end = new Date(start.getTime() + Number(appt.duration || 0) / 1_000_000)
  return end
}

const todayIntervals = computed(() => {
  // If no business hours, default to one interval: 08:00-20:00
  const intervals = businessHours.value.length
    ? businessHours.value
    : [{ start: '08:00', end: '20:00' }]

  // Build Date objects for today for each interval
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')

  // Sort appointments by start time
  const appts = [...dayAppointments.value].sort((a, b) => new Date(a.start) - new Date(b.start))

  const result = []

  for (const interval of intervals) {
    const intervalStart = new Date(`${y}-${m}-${d}T${interval.start}:00`)
    const intervalEnd = new Date(`${y}-${m}-${d}T${interval.end}:00`)

    // Appointments that start within this interval
    const apptsInInterval = appts.filter((a) => {
      const s = new Date(a.start)
      return s >= intervalStart && s < intervalEnd
    })

    let lastEnd = intervalStart

    if (apptsInInterval.length === 0) {
      // Whole interval is free
      if (intervalEnd - intervalStart >= 20 * 60 * 1000) {
        result.push({
          type: 'free',
          start: intervalStart,
          end: intervalEnd,
        })
      }
      continue
    }

    for (const appt of apptsInInterval) {
      const apptStart = new Date(appt.start)
      const apptEnd = new Date(apptStart.getTime() + Number(appt.duration || 0) / 1_000_000)
      // Free before this appointment
      if (apptStart - lastEnd >= 20 * 60 * 1000) {
        result.push({
          type: 'free',
          start: new Date(lastEnd),
          end: new Date(apptStart),
        })
      }
      // The appointment itself
      result.push({
        type: 'appt',
        appt,
      })
      lastEnd = apptEnd
    }
    // Free after last appointment in interval
    if (intervalEnd - lastEnd >= 20 * 60 * 1000) {
      result.push({
        type: 'free',
        start: new Date(lastEnd),
        end: intervalEnd,
      })
    }
  }

  return result
})
// Demo/mock data for pending exams
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
  position: relative;
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

.suggestions-list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0 0 8px 8px;
  width: 100%;
  max-width: 800px;
  z-index: 100;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.suggestions-list li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  background: white;
  transition: background 0.2s;
}

.suggestions-list li:last-child {
  border-bottom: none;
}

.suggestions-list li:hover {
  background: var(--color-background-soft);
}

.no-results {
  color: #888;
  font-style: italic;
  cursor: default;
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
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid var(--color-border);
}

.section li:hover {
  background-color: var(--color-background);
}

/* Rounded corners for first and last li in the list */
.section ul li:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.section ul li:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.day-summary-header {
  margin-bottom: 1rem;
}

.day-summary-title {
  font-weight: 500;
  color: #1976d2;
}

.appointment-item {
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  background: transparent;
}

.appointment-item:last-child {
  border-bottom: none;
}

.no-appointments {
  color: #888;
  font-style: italic;
  padding: 0.5rem 0;
}

.interval-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.5rem 0.7rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1rem;
  background: transparent;
  transition: background 0.18s;
}

.interval-row:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.interval-row:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: none;
}

.interval-time {
  min-width: 120px;
  font-family: 'Fira Mono', monospace;
  font-size: 1.02em;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.interval-label {
  flex: 1;
  color: #333;
  font-weight: 500;
  white-space: pre-line;
}

.free-interval .interval-label {
  color: #888;
  font-style: italic;
  font-weight: 400;
}

.appointment-item {
  cursor: pointer;
}

.appointment-item:hover {
  background: #f0f4fa;
}
.free-interval {
  color: #333;
  font-weight: 500;
  background: transparent;
}
</style>