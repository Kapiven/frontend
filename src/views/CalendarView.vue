<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <h2>Calendario de Citas</h2>
      <div class="header-actions">
        <!-- Modern date navigation -->
        <div class="date-navigator">
          <button class="nav-arrow" @click="changeMonth(-1)">
            <span class="arrow-icon">&#8249;</span>
          </button>
          <div class="date-selector" @click="showDatePicker = !showDatePicker">
            <span>{{ monthNames[displayMonth] }} {{ displayYear }}</span>
            <span class="dropdown-icon">&#9662;</span>

            <!-- Month/Year picker dropdown -->
            <div v-if="showDatePicker" class="date-picker-dropdown">
              <div class="picker-header">
                <button @click.stop="tempYear = tempYear - 1">&#8249;</button>
                <span>{{ tempYear }}</span>
                <button @click.stop="tempYear = tempYear + 1">&#8250;</button>
              </div>
              <div class="month-grid">
                <div
                  v-for="(month, idx) in monthNames"
                  :key="month"
                  :class="[
                    'month-item',
                    displayMonth === idx && tempYear === displayYear ? 'selected' : '',
                  ]"
                  @click.stop="selectMonth(idx)"
                >
                  {{ month.substring(0, 3) }}
                </div>
              </div>
            </div>
          </div>
          <button class="nav-arrow" @click="changeMonth(1)">
            <span class="arrow-icon">&#8250;</span>
          </button>
        </div>
        <button @click="dashboardRedirect">Dashboard</button>
      </div>
    </div>

    <!-- Display loading or error states -->
    <p v-if="loading" class="loading">Cargando citas...</p>
    <p v-if="error" class="error">Error al cargar citas: {{ error.message }}</p>

    <div v-if="!loading && !error" class="calendar-grid-wrapper">
      <!-- Day of week headers -->
      <div class="weekday-row">
        <div class="weekday-header" v-for="day in weekDays" :key="day">
          {{ day }}
        </div>
      </div>

      <!-- Calendar grid with transition -->
      <transition name="calendar-fade" mode="out-in">
        <div :key="`${displayYear}-${displayMonth}`" class="calendar-container">
          <!-- Calendar grid with properly placed dates -->
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-day"
            :class="{
              'empty-day': !day,
              'current-day': isCurrentDay(day),
            }"
          >
            <div v-if="day" class="day-number">
              {{ day }}
              <button class="expand-btn" @click.stop="openDayModal(day)" aria-label="Detalles">
                <!-- Expand (corners) icon -->
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <polyline
                    points="3,8 3,3 8,3"
                    stroke="#1976d2"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <polyline
                    points="12,3 17,3 17,8"
                    stroke="#1976d2"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <polyline
                    points="17,12 17,17 12,17"
                    stroke="#1976d2"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <polyline
                    points="8,17 3,17 3,12"
                    stroke="#1976d2"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <ul v-if="day" class="appointments">
              <!-- Loop through appointments fetched from the backend for this specific day -->
              <li
                v-for="appt in getAppointmentsForDay(day)"
                :key="appt.id"
                @click="openAppointmentDetails(appt)"
                class="appointment-item"
              >
                <span>{{ formatStartTime(appt.start) }} - {{ appt.name }}</span>
              </li>
              <!-- Display a message if no appointments for this day - NOT CLICKABLE -->
              <li v-if="getAppointmentsForDay(day).length === 0" class="no-appointments">
                No hay citas
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>

    <!-- Add/Edit Appointment Modal -->
    <div v-if="showAppointmentModal" class="modal-overlay">
      <div class="modal appointment-form-modal">
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Editar Cita' : 'Nueva Cita' }}</h3>
          <button class="close-button" @click="closeAppointmentModal">×</button>
        </div>

        <form @submit.prevent="submitAppointmentForm">
          <div class="form-group">
            <label for="appt-date">Fecha</label>
            <input
              id="appt-date"
              type="date"
              v-model="appointmentForm.date"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="appt-time">Hora</label>
            <input
              id="appt-time"
              type="time"
              v-model="appointmentForm.time"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="appt-duration">Duración (minutos)</label>
            <input
              id="appt-duration"
              type="number"
              v-model="appointmentForm.duration"
              min="1"
              required
              class="form-input"
            />
          </div>

          <div class="form-group" v-if="!isEditMode" style="position: relative">
            <label for="appt-patient">Paciente (Nombre o ID)</label>
            <input
              id="appt-patient"
              type="text"
              v-model="patientSearchQuery"
              @input="onPatientInput"
              @blur="hidePatientSuggestions"
              placeholder="Nombre del paciente"
              required
              class="form-input"
              autocomplete="off"
            />
            <ul v-if="showPatientSuggestions" class="suggestions-list">
              <li
                v-for="patient in patientSuggestions"
                :key="patient.id"
                @click="selectPatientSuggestion(patient)"
                class="suggestion-item"
              >
                <span class="suggestion-name">{{ patient.name }}</span>
                <span class="suggestion-phone">{{ patient.phone }}</span>
              </li>
              <li
                v-if="!patientSuggestions.length && patientSearchQuery.length >= 2"
                class="no-results"
              >
                No se encontraron pacientes
              </li>
            </ul>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ isEditMode ? 'Guardar Cambios' : 'Guardar' }}
            </button>
            <button type="button" class="btn-secondary" @click="closeAppointmentModal">
              Cancelar
            </button>
          </div>
        </form>

        <!-- Display potential errors from adding/editing appointment -->
        <p v-if="formError" class="error">{{ formError.message }}</p>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal appointment-details-modal">
        <!-- Display loading/error states -->
        <div v-if="detailsLoading" class="details-loading">
          <p>Cargando detalles...</p>
        </div>

        <div v-else-if="detailsError" class="error-container">
          <p class="error">Error al cargar detalles: {{ detailsError.message }}</p>
        </div>

        <!-- Display details if loaded and no error -->
        <div v-else-if="selectedAppointment && selectedPatient" class="appointment-details">
          <div class="modal-header">
            <h3>Detalles de Cita</h3>
            <button class="close-button" @click="showDetailsModal = false">×</button>
          </div>

          <!-- Main Section: Patient & Appointment Info -->
          <div class="details-main-info">
            <h2 class="patient-name">{{ selectedPatient.name }}</h2>
            <div class="appointment-time-info">
              <p class="appointment-date">
                {{ formatFullDate(selectedAppointment.start) }}
              </p>
              <p class="appointment-time">
                {{ formatTimeRange(selectedAppointment.start, selectedAppointment.duration) }}
              </p>
            </div>
          </div>

          <!-- Patient Contact Information -->
          <div class="details-section">
            <h4 class="section-title">Información de Contacto</h4>
            <div class="section-content">
              <p v-if="selectedPatient.phone" class="contact-info">
                <strong>Teléfono:</strong> {{ selectedPatient.phone }}
              </p>
              <p v-if="selectedPatient.email" class="contact-info">
                <strong>Email:</strong> {{ selectedPatient.email }}
              </p>
              <p v-if="!selectedPatient.phone && !selectedPatient.email" class="no-data">
                No hay información de contacto disponible
              </p>
            </div>
          </div>

          <!-- Medical History (Antecedentes) -->
          <div v-if="selectedPatient.antecedentes" class="details-section antecedentes-section">
            <h4 class="section-title">Antecedentes</h4>
            <div class="section-content">
              <div v-if="hasAntecedentes" class="antecedentes-grid">
                <div v-if="selectedPatient.antecedentes.medical" class="antecedente-item">
                  <h5>Médicos</h5>
                  <p>{{ selectedPatient.antecedentes.medical }}</p>
                </div>
                <div v-if="selectedPatient.antecedentes.family" class="antecedente-item">
                  <h5>Familiares</h5>
                  <p>{{ selectedPatient.antecedentes.family }}</p>
                </div>
                <div v-if="selectedPatient.antecedentes.ocular" class="antecedente-item">
                  <h5>Oculares</h5>
                  <p>{{ selectedPatient.antecedentes.ocular }}</p>
                </div>
                <div v-if="selectedPatient.antecedentes.allergic" class="antecedente-item">
                  <h5>Alérgicos</h5>
                  <p>{{ selectedPatient.antecedentes.allergic }}</p>
                </div>
                <div v-if="selectedPatient.antecedentes.other" class="antecedente-item">
                  <h5>Otros</h5>
                  <p>{{ selectedPatient.antecedentes.other }}</p>
                </div>
              </div>
              <p v-else class="no-data">No hay antecedentes registrados</p>
            </div>
          </div>

          <!-- Notes Section (if available) -->
          <div v-if="selectedAppointment.notes" class="details-section">
            <h4 class="section-title">Notas de la Cita</h4>
            <div class="section-content">
              <p class="appointment-notes">{{ selectedAppointment.notes }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions appointment-actions">
            <button class="action-button edit-button" @click="editAppointment(selectedAppointment)">
              Editar Cita
            </button>
            <button class="action-button delete-button" @click="confirmDeleteAppointment">
              Cancelar Cita
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Details Modal -->
    <div v-if="showDayModal" class="modal-overlay" @click.self="closeDayModal">
      <div class="modal expanded-day-modal">
        <div class="modal-header">
          <h3>{{ expandedDay }} de {{ monthNames[displayMonth] }} {{ displayYear }}</h3>
          <button class="close-button" @click="closeDayModal">×</button>
        </div>
        <div class="modal-content">
          <div class="day-summary-header" style="margin-bottom: 1rem">
            <span class="day-summary-title">
              Horario laboral:
              <span v-if="dayModalBusinessHours.length">
                <span v-for="(interval, idx) in dayModalBusinessHours" :key="idx">
                  {{ interval.start }} - {{ interval.end
                  }}<span v-if="idx < dayModalBusinessHours.length - 1">,&nbsp;</span>
                </span>
              </span>
              <span v-else>Dia Libre</span>
            </span>
          </div>

          <ul>
            <template v-for="(item, idx) in dayModalIntervals" :key="idx">
              <li
                v-if="item.type === 'free'"
                class="interval-row free-interval"
                @click="openNewAppointmentModalForInterval(expandedDay, item.start)"
                style="cursor: pointer"
              >
                <span class="interval-time">
                  {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
                </span>
                <span class="interval-label">Libre (Click para agendar)</span>
              </li>
              <li v-else class="interval-row" @click="openAppointmentDetails(item.appt)">
                <span class="interval-time">
                  {{ formatTime(item.appt.start) }} - {{ formatTime(getApptEnd(item.appt)) }}
                </span>
                <span class="interval-label">{{ item.appt.name }}</span>
              </li>
            </template>
            <li v-if="dayModalIntervals.length === 0" class="no-appointments">
              No hay citas ni intervalos libres de 20+ minutos
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import debounce from 'lodash.debounce'
import { useRouter } from 'vue-router'
// Import the service function to fetch appointments
import {
  getAppointmentsForMonth,
  updateAppointment,
  createAppointment,
} from '@/services/appointmentService'
import { getPatientById, searchPatients } from '@/services/patientService'
import { getBusinessHoursForDay } from '@/services/businessHoursService'
import { getAppointmentsForDate, deleteAppointment } from '@/services/appointmentService'

const patientSearchQuery = ref('')
const patientSuggestions = ref('')
const showPatientSuggestions = ref(false)
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth() // getMonth() is 0-indexed (0 for January)
const currentDay = today.getDate() // Get current day of month

// Display state (what's shown to the user)
const displayYear = ref(currentYear)
const displayMonth = ref(currentMonth)

// Temporary state for date picker
const tempYear = ref(currentYear)

const showDayModal = ref(false)
const expandedDay = ref(null)
const dayModalBusinessHours = ref([])
const dayModalAppointments = ref([])
const showDetailsModal = ref(false)
const selectedAppointment = ref(null) // To store the clicked appointment
const selectedPatient = ref(null) // To store the fetched patient details
const detailsLoading = ref(false)
const detailsError = ref(null)
const showDatePicker = ref(false) // For the new date picker dropdown

const router = useRouter()
// Appointment form state
const showAppointmentModal = ref(false)
const isEditMode = ref(false)
const appointmentForm = ref({
  id: null,
  date: '',
  time: '',
  duration: 30,
  name: '',
  patient_id: null,
  notes: '',
})
const formError = ref(null)

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

// Days of the week headers
const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const dayModalDateStr = computed(() => {
  if (!expandedDay.value) return null
  return `${displayYear.value}-${String(displayMonth.value + 1).padStart(2, '0')}-${String(expandedDay.value).padStart(2, '0')}`
})

function dashboardRedirect() {
  router.push('/dashboard')
}

// Check if a day is the current day
function isCurrentDay(day) {
  return (
    day === currentDay && displayMonth.value === currentMonth && displayYear.value === currentYear
  )
}

function hidePatientSuggestions() {
  setTimeout(() => {
    showPatientSuggestions.value = false
  }, 120)
}

// Close date picker when clicking outside
function handleClickOutside(event) {
  if (showDatePicker.value && !event.target.closest('.date-selector')) {
    showDatePicker.value = false
    // Reset tempYear if picker is closed without selecting a month
    tempYear.value = displayYear.value
  }
}

function onPatientInput() {
  fetchPatientSuggestions(patientSearchQuery.value)
  appointmentForm.value.patient_id = null
}

function selectPatientSuggestion(patient) {
  appointmentForm.value.patient_id = patient.id
  appointmentForm.value.name = patient.name
  patientSearchQuery.value = patient.name
  showPatientSuggestions.value = false
}

const fetchPatientSuggestions = debounce(async (q) => {
  if (q.length < 2) {
    patientSuggestions.value = []
    showPatientSuggestions.value = false
    return
  }
  const results = await searchPatients(q)
  patientSuggestions.value = results
  showPatientSuggestions.value = results.length > 0
}, 150)

const dayModalIntervals = computed(() => {
  const intervals = dayModalBusinessHours.value.length ? dayModalBusinessHours.value : []

  if (!expandedDay.value) return []

  const [y, m, d] = dayModalDateStr.value.split('-')
  const appts = [...dayModalAppointments.value].sort(
    (a, b) => new Date(a.start) - new Date(b.start),
  )
  const result = []

  for (const interval of intervals) {
    const intervalStart = new Date(`${y}-${m}-${d}T${interval.start}:00`)
    const intervalEnd = new Date(`${y}-${m}-${d}T${interval.end}:00`)
    const apptsInInterval = appts.filter((a) => {
      const s = new Date(a.start)
      return s >= intervalStart && s < intervalEnd
    })

    let lastEnd = intervalStart

    if (apptsInInterval.length === 0) {
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
      if (apptStart - lastEnd >= 20 * 60 * 1000) {
        result.push({
          type: 'free',
          start: new Date(lastEnd),
          end: new Date(apptStart),
        })
      }
      result.push({
        type: 'appt',
        appt,
      })
      lastEnd = apptEnd
    }
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
async function openDayModal(day) {
  expandedDay.value = day
  showDayModal.value = true
  if (!day) return
  try {
    dayModalBusinessHours.value = await getBusinessHoursForDay(dayModalDateStr.value)
  } catch (e) {
    dayModalBusinessHours.value = []
  }
  try {
    dayModalAppointments.value = await getAppointmentsForDate(dayModalDateStr.value)
  } catch (e) {
    dayModalAppointments.value = []
  }
}
function closeDayModal() {
  showDayModal.value = false
  expandedDay.value = null
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Smoothly change month with transition
function changeMonth(direction) {
  if (direction > 0) {
    if (displayMonth.value === 11) {
      displayMonth.value = 0
      displayYear.value++
      tempYear.value = displayYear.value
    } else {
      displayMonth.value++
    }
  } else {
    if (displayMonth.value === 0) {
      displayMonth.value = 11
      displayYear.value--
      tempYear.value = displayYear.value
    } else {
      displayMonth.value--
    }
  }
}

function openNewAppointmentModalForInterval(day, startDate) {
  patientSearchQuery.value = appointmentForm.value.name || ''
  isEditMode.value = false
  // startDate is a Date object
  appointmentForm.value = {
    id: null,
    date: formatDateForInput(startDate),
    time: formatTimeForInput(startDate),
    duration: 20, // or suggest based on interval length
    name: '',
    patient_id: null,
    notes: '',
  }
  patientSearchQuery.value = ''
  patientSuggestions.value = []
  showPatientSuggestions.value = false
  formError.value = null
  showAppointmentModal.value = true
  showDayModal.value = false
}

// Select month from dropdown - now applies the tempYear too
function selectMonth(monthIndex) {
  displayMonth.value = monthIndex
  displayYear.value = tempYear.value
  showDatePicker.value = false
}

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

// Computed property to check if patient has any antecedentes
const hasAntecedentes = computed(() => {
  if (!selectedPatient.value || !selectedPatient.value.antecedentes) return false

  const a = selectedPatient.value.antecedentes
  return !!(a.medical || a.family || a.ocular || a.allergic || a.other)
})

const daysInMonth = computed(() => {
  // The last day of the month is obtained by setting the day to 0 of the *next* month
  return new Date(displayYear.value, displayMonth.value + 1, 0).getDate()
})

// Calculate the number of rows needed for the calendar
const calendarRows = computed(() => {
  const firstDayOfMonth = new Date(displayYear.value, displayMonth.value, 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  const totalDaysDisplayed = adjustedFirstDay + daysInMonth.value
  return Math.ceil(totalDaysDisplayed / 7) // Number of rows needed
})

// Calculate the calendar days with proper grid placement
const calendarDays = computed(() => {
  const year = displayYear.value
  const month = displayMonth.value
  const daysCount = daysInMonth.value

  // Get the first day of the month (0-6 where 0 is Sunday)
  let firstDayOfMonth = new Date(year, month, 1).getDay()

  // Convert to 0-6 where 0 is Monday and 6 is Sunday
  firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  // Create array for calendar cells
  const days = []

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysCount; i++) {
    days.push(i)
  }

  // Add empty cells to complete the grid rows needed for this month specifically
  const totalCells = calendarRows.value * 7
  while (days.length < totalCells) {
    days.push(null)
  }

  return days
})

// State to store the fetched appointments, grouped by date string (YYYY-MM-DD)
const appointmentsByDate = ref({})

const loading = ref(false)
const error = ref(null)

// Function to fetch appointments for the selected month and year
async function fetchAppointments() {
  loading.value = true
  error.value = null
  appointmentsByDate.value = {} // Clear previous appointments
  try {
    // Backend's getAppointmentsForMonth expects year (int) and month (1-12)
    // selectedMonth is 0-indexed, so add 1
    const fetchedData = await getAppointmentsForMonth(
      displayYear.value,
      displayMonth.value + 1, // <--- PASS 1-INDEXED MONTH TO SERVICE
    )

    // The backend returns the data already grouped by date
    appointmentsByDate.value = fetchedData // <--- STORE THE FETCHED MAP
  } catch (err) {
    error.value = err
    console.error('Error fetching appointments:', err)
  } finally {
    loading.value = false
  }
}

// Fetch appointments when the component is mounted
onMounted(fetchAppointments)

// Watch for changes in displayYear or displayMonth and fetch appointments again
watch([displayYear, displayMonth], fetchAppointments) // <--- WATCHERS

// Computed property to get appointments for a specific day number (1-based)
// This now looks up appointments in the fetched map
function getAppointmentsForDay(day) {
  // Format the date key to match the backend's map key format (YYYY-MM-DD)
  const dayKey = `${displayYear.value}-${String(displayMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  // Return the array of appointments for that date key, or an empty array if the key doesn't exist
  return appointmentsByDate.value[dayKey] || []
}

// Format time range, handling duration as nanoseconds
function formatTimeRange(startStr, durationNanoseconds) {
  const start = new Date(startStr) // Create Date object from timestamp string

  // Convert duration from nanoseconds to milliseconds
  const durationMilliseconds = Number(durationNanoseconds) / 1_000_000
  const end = new Date(start.getTime() + durationMilliseconds) // Add milliseconds to start time

  const pad = (n) => String(n).padStart(2, '0')
  // Use getHours() and getMinutes() from Date objects
  return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`
}

// Format just the start time (HH:MM)
function formatStartTime(startStr) {
  const start = new Date(startStr) // Create Date object from timestamp string
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(start.getHours())}:${pad(start.getMinutes())}` // Return just HH:MM
}

// Format the full date for display (e.g., "Lunes, 14 de Mayo de 2025")
function formatFullDate(dateStr) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return 'Fecha inválida'
  }

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  // Use locale-specific formatting (capitalize first letter)
  let formattedDate = date.toLocaleDateString('es-ES', options)
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

// Convert a Date to YYYY-MM-DD format
function formatDateForInput(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Convert a Date to HH:MM format
function formatTimeForInput(date) {
  const d = new Date(date)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// --- Open the New Appointment Modal ---
function openNewAppointmentModal() {
  isEditMode.value = false

  // Set today's date and current time as default
  const now = new Date()
  appointmentForm.value = {
    id: null,
    date: formatDateForInput(now),
    time: formatTimeForInput(now),
    duration: 20,
    name: '',
    patient_id: null,
    notes: '',
  }

  formError.value = null
  showAppointmentModal.value = true
}

// --- Close the Appointment Modal ---
function closeAppointmentModal() {
  showAppointmentModal.value = false
}

// --- Submit the Appointment Form (Add/Edit) ---

async function submitAppointmentForm() {
  formError.value = null

  // Prepare ISO string in Guatemala time (UTC-6)
  const date = appointmentForm.value.date
  const time = appointmentForm.value.time
  // Combine date and time, add -06:00 for Guatemala
  const startDateTimeString = `${date}T${time}:00-06:00`

  // Convert duration from minutes to seconds (or nanoseconds if your backend expects it)
  // Here, let's assume seconds (adjust if needed)
  const durationNanoseconds = Number(appointmentForm.value.duration) * 60 * 1_000_000_000

  // Prepare the payload
  const appointmentPayload = {
    patient_id: appointmentForm.value.patient_id || null,
    name: appointmentForm.value.name,
    start: startDateTimeString,
    duration: durationNanoseconds,
    notes: appointmentForm.value.notes,
  }

  try {
    if (isEditMode.value) {
      // For update, include the ID
      await updateAppointment({ ...appointmentPayload, id: appointmentForm.value.id })
    } else {
      await createAppointment(appointmentPayload)
    }
    showAppointmentModal.value = false
    await fetchAppointments()
  } catch (err) {
    formError.value = err
    console.error('Error creating/updating appointment:', err)
  }
}

// --- Function to open the details modal and fetch patient info ---
async function openAppointmentDetails(appointment) {
  selectedAppointment.value = appointment // Store the clicked appointment
  selectedPatient.value = null // Clear previous patient details
  detailsLoading.value = true
  detailsError.value = null
  showDetailsModal.value = true // Open the modal immediately

  // Fetch patient details using the appointment's patient_id
  // Check if patient_id is valid before fetching
  if (appointment.patient_id > 0) {
    try {
      // Call the patient service to fetch patient details
      const patient = await getPatientById(appointment.patient_id)
      selectedPatient.value = patient // Store the fetched patient
    } catch (err) {
      detailsError.value = err
      console.error(`Error fetching patient details for ID ${appointment.patient_id}:`, err)
    } finally {
      detailsLoading.value = false // Loading is done
    }
  } else {
    // Handle appointments with no patient ID
    selectedPatient.value = {
      name: appointment.name || 'Paciente Nuevo',
      phone: null,
      email: null,
      sex: null,
      antecedentes: null,
    }
    detailsLoading.value = false
  }
}

// --- Function to edit an appointment ---
function editAppointment(appointment) {
  // First close the details modal
  showDetailsModal.value = false

  // Set up edit mode and populate the form
  isEditMode.value = true

  const startDate = new Date(appointment.start)

  appointmentForm.value = {
    id: appointment.id,
    date: formatDateForInput(startDate),
    time: formatTimeForInput(startDate),
    duration: Number(appointment.duration) / (60 * 1_000_000_000), // Convert from ns to minutes
    name: appointment.name,
    patient_id: appointment.patient_id,
    notes: appointment.notes || '',
  }

  // Show the appointment form modal
  showAppointmentModal.value = true
}

// --- Function to handle delete confirmation ---
function confirmDeleteAppointment() {
  if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
    removeAppointment(selectedAppointment.value.id)
    showDetailsModal.value = false
  }
}

// --- Remove Appointment Logic ---
async function removeAppointment(id) {
  console.log('Attempting to remove appointment with ID:', id)

  // --- Call backend API to remove appointment ---
  try {
    await deleteAppointment(id)

    showDetailsModal.value = false
    await fetchAppointments()
  } catch (err) {
    console.error('Error removing appointment:', err)
    alert('Error removing appointment: ' + err.message)
  }
}
</script>

<style scoped>
.calendar-page {
  max-width: 98vw;
  min-width: 320px;
  width: 98vw;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2rem;
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
  width: 100%;
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

.modal-content ul {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 0;
}

.interval-time {
  min-width: 120px;
  font-family: 'Fira Mono', 'monospace';
  font-size: 1.02em;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.02em;
  align-items: flex-start;
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

/* Fixed size calendar grid wrapper */
.calendar-grid-wrapper {
  display: flex;
  flex-direction: column;
  height: 700px; /* Fixed height for consistency */
  min-height: 700px; /* Minimum height */
  max-height: 700px; /* Maximum height */
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0; /* Don't allow shrinking */
}

/* Weekday headers */
.weekday-header {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  text-align: center;
  padding: 0.7rem 0;
  border-radius: 0.3rem;
}

/* Calendar container with grid */
.calendar-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr; /* Equal height rows */
  gap: 0.5rem;
  flex-grow: 1; /* Let calendar take remaining space */
  overflow-y: auto; /* Add scroll if needed */
}

/* Calendar fade transition */
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.calendar-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.calendar-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Individual Day Cell */
.calendar-day {
  background: #f8f9fa; /* Very light gray */
  border-radius: 0.5rem; /* Slightly more rounded for modern look */
  padding: 0.6rem;
  position: relative;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 80px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.calendar-day {
  position: relative;
}

.expand-btn {
  position: absolute;
  top: 0.4em;
  right: 0.4em;
  background: transparent;
  border: none;
  padding: 0.15em;
  border-radius: 25%;
  cursor: pointer;
  transition:
    background 0.18s,
    box-shadow 0.18s;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-btn:hover {
  background: #e3eafc;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.expand-btn svg {
  display: block;
  pointer-events: none; /* So only the button, not the SVG, handles clicks */
}
/* Current day styling - ONLY light blue background, NO border */
.current-day {
  background: rgba(25, 118, 210, 0.05); /* Very light blue */
}

/* Modern hover effect with elevation instead of border */
.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* Empty cells */
.empty-day {
  background: #f0f0f0;
  border: 1px dashed #ddd;
  opacity: 0.7;
}

.empty-day:hover {
  transform: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.day-number {
  padding-left: 0.25rem;
  font-weight: bold;
  color: #111;
  margin-bottom: 0.3rem;
}

/* Appointments List */
.appointments {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow-y: auto;
  flex-grow: 1;

  /* Hide scrollbar for Webkit browsers */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

/* Individual Appointment Item */
.appointment-item {
  background-color: transparent;
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  color: #333;
  width: 100%;
  word-break: break-word;
  line-height: 1.3;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.appointment-item:first-child {
  border-top-right-radius: 0.25rem;
  border-top-left-radius: 0.25rem;
}

.appointment-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.appointment-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.appointment-item span {
  color: #333;
  flex-grow: 1;
}

/* No appointments message - NOT clickable */
.no-appointments {
  color: #888;
  font-style: italic;
  cursor: default;
  padding: 0.5rem 0.25rem;
  border-bottom: none;
}

.no-appointments:hover {
  background-color: transparent;
}

/* Modern date navigation styles */
.date-navigator {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 0.5rem;
  padding: 0.2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-arrow {
  background: transparent !important;
  color: #333 !important;
  border: none;
  font-size: 1.5rem;
  padding: 0.2rem 0.7rem !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3rem;
  transition: background 0.2s;
}

.nav-arrow:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

.arrow-icon {
  line-height: 1;
}

.date-selector {
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.dropdown-icon {
  font-size: 0.8rem;
  color: #666;
}

.date-picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 280px;
  padding: 1rem;
  z-index: 1001;
  animation: dropdown-fade 0.2s ease;
}

@keyframes dropdown-fade {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.picker-header button {
  background: transparent !important;
  color: #333 !important;
  border: none;
  font-size: 1.2rem;
  padding: 0.2rem 0.5rem !important;
  cursor: pointer;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.month-item {
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-item:hover {
  background: #f0f0f0;
}

.month-item.selected {
  background: #1976d2;
  color: white;
}

/* Updated Appointment Form Modal styles */
.appointment-form-modal {
  width: 90%;
  max-width: 480px;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background: #f9f9f9;
  font-size: 1rem;
  color: #333;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1976d2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: modal-fade 0.3s ease;
}

@keyframes modal-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  min-width: 320px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  animation: modal-slide 0.3s ease;
}

@keyframes modal-slide {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #1976d2;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* Button styles */
.btn-primary,
.btn-secondary {
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Appointment Details Modal specific styles */
.appointment-details-modal {
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: hidden;
}

.details-main-info {
  background-color: #f5f8ff;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.patient-name {
  color: #1c2b46;
  font-size: 1.6rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.appointment-time-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.appointment-date,
.appointment-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.details-section {
  margin-bottom: 1rem;
}

.details-section:last-child {
  border-bottom: none;
  margin-bottom: 0.5rem;
  padding-bottom: 0;
}

.section-title {
  color: #1976d2;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
}

.section-content {
  padding: 0 0.5rem;
}

.contact-info {
  margin: 0.5rem 0;
  font-size: 1.05rem;
}

.no-data {
  color: #777;
  font-style: italic;
}

.antecedentes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.antecedente-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
}

.antecedente-item h5 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;
}

.antecedente-item p {
  margin: 0;
  color: #555;
}

.appointment-notes {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 3px solid #1976d2;
}

.appointment-actions {
  justify-content: space-between;
  border-top: 1px solid #eaeaea;
  padding-top: 1.5rem;
  margin-top: 2rem;
}

.action-button {
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background: #1976d2;
  color: white;
}

.edit-button:hover {
  background: #125ea7;
}

.delete-button {
  background: #fff;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}

.delete-button:hover {
  background: #fff8f8;
}

.details-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #666;
}

.error-container {
  padding: 1rem;
  color: #d32f2f;
  text-align: center;
}

.suggestions-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #eee;
  width: 100%;
  z-index: 1002;
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 220px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  background: white;
  transition: background 0.18s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-name {
  font-weight: 500;
  color: #333;
}

.suggestion-phone {
  color: #888;
  font-size: 0.95em;
  margin-left: 1.5em;
}

.suggestion-item:hover {
  background: #f0f4fa;
}

.no-results {
  color: #888;
  font-style: italic;
  padding: 0.5rem 1rem;
  cursor: default;
}

@media (max-width: 900px) {
  .calendar-page {
    padding: 0.5rem;
  }
  .calendar-grid-wrapper {
    height: 500px;
    min-height: 500px;
    max-height: 500px;
  }
  .antecedentes-grid {
    grid-template-columns: 1fr;
  }
  .appointment-time-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
