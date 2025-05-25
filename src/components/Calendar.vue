<template>
  <div class="calendar-page">
    <CalendarHeader
      v-model:showDatePicker="showDatePicker"
      :displayMonth="displayMonth"
      :displayYear="displayYear"
      @update:month="displayMonth = $event"
      @update:year="displayYear = $event"
      @dashboard-redirect="dashboardRedirect"
    />

    <!-- Day of week headers -->
    <WeekDaysHeader/>

    <!-- Display loading or error states -->
    <p v-if="loading" class="loading">Cargando citas...</p>
    <p v-if="error" class="error">Error al cargar citas: {{ error.message }}</p>

    <div v-if="!loading && !error" class="calendar-grid-wrapper">
      <!-- Calendar grid with transition -->
      <CalendarGrid
        :year="displayYear"
        :month="displayMonth"
        :days="calendarDays"
        :get-appointments-for-day="getAppointmentsForDay"
        :is-current-day="isCurrentDay"
        @day-clicked="openDayModal"
        @appointment-clicked="openAppointmentDetails"
      />
    </div>

    <!-- Add/Edit Appointment Modal -->
    <div v-if="showAppointmentModal" class="modal-overlay" @click.self="closeAppointmentModal">
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
    <DayModal
      :show="showDayModal"
      :expandedDay="expandedDay"
      :displayMonth="displayMonth"
      :displayYear="displayYear"
      :monthNames="monthNames"
      :dayModalBusinessHours="dayModalBusinessHours"
      :dayModalIntervals="dayModalIntervals"
      :formatTime="formatTime"
      :getApptEnd="getApptEnd"
      @close="closeDayModal"
      @open-new-appt="({ day, start }) => openNewAppointmentModalForInterval(day, start)"
      @open-appt-details="openAppointmentDetails"
    />
  </div>
</template>

<script setup>
import CalendarHeader from './Calendar/CalendarHeader.vue'
import WeekDaysHeader from './Calendar/WeekDaysHeader.vue'
import CalendarGrid from './Calendar/CalendarGrid.vue'
import DayModal from './Calendar/DayModal.vue'
import '@/assets/styles/calendar.css'
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
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

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

const showDatePicker = ref(false)

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