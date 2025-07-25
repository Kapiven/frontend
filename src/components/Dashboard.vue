<template>
  <div class="dashboard">
    <SearchBar :fetchDaySummary="fetchDaySummary" :patientRedirect="patientRedirect" />

    <div class="quick-actions">
      <button @click="calendarRedirect">Calendario</button>
      <button @click="consultRedirect">Consultas</button>
    </div>

    <div class="section-wrapper">
      <DashboardSection
        :titles="['Citas de Hoy', 'Exámenes Pendientes']"
        :todayIntervals="todayIntervals"
        :formatTime="formatTime"
        @patientRedirect="patientRedirect"
        :recentExams="recentExams"
        @openExamUploadModal="handleOpenExamUploadModal"
      />
    </div>

    <NewExamModal
      v-if="showExamModal"
      :selected-exam="selectedExamForModal"
      @close="closeNewExamModal"
      @examUpdated="handleExamFileUploaded"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPatientById } from '@/services/patientService'
import SearchBar from './Dashboard/SearchBar.vue'
import DashboardSection from './Dashboard/DashboardSection.vue'
import NewExamModal from '@/components/PatientPage/NewExamModal.vue'
import { getBusinessHoursForDay } from '@/services/businessHoursService'
import { getAppointmentsForDate } from '@/services/appointmentService'
import { getPendingExams } from '@/services/examService'
import '@/assets/styles/dashboard.css'

const router = useRouter()

// Estados reactivos
const showExamModal = ref(false)
const selectedExamForModal = ref(null)
const businessHours = ref([])
const dayAppointments = ref([])
const recentExams = ref([])

const todayStr = new Date().toISOString().slice(0, 10)

onMounted(() => {
  fetchPendingExamsIntoRecentExams()
})

// Funciones de redirección
function calendarRedirect() {
  router.push('/calendar')
}

function consultRedirect() {
  alert('Redirigir a consultas...')
}

function patientRedirect(patientId) {
  router.push({ name: 'patient', params: { patientId } })
}

// Lógica de citas
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

// Handle opening exam upload modal
function handleOpenExamUploadModal(exam) {
  selectedExamForModal.value = exam
  showExamModal.value = true
}

// Close modal handler
function closeNewExamModal() {
  showExamModal.value = false
  selectedExamForModal.value = null
}

// Handle exam file uploaded
async function handleExamFileUploaded(examId) {
  console.log(`Exam ID ${examId} file uploaded successfully. Re-fetching exams.`)
  await fetchPendingExamsIntoRecentExams()
  // Update the currently selected exam object in the modal to reflect new has_file status
  const updatedExam = recentExams.value.find((e) => e.id === examId)
  if (updatedExam) {
    selectedExamForModal.value = updatedExam
  }
}

async function fetchPendingExamsIntoRecentExams() {
  try {
    const rawExams = await getPendingExams() // Get exams from backend (contains patient_id)

    // Collect unique patient IDs from the raw exams
    const patientIds = [...new Set(rawExams.map((exam) => exam.patient_id))]

    // Fetch all unique patient details in parallel using getPatientById
    const patientPromises = patientIds.map((id) =>
      getPatientById(id)
        .then((patient) => ({ id: patient.id, name: patient.name })) // Assuming patient.name exists
        .catch((error) => {
          console.warn(`Could not fetch name for patient ID ${id}:`, error)
          return { id, name: `Paciente Desconocido (ID:${id})` } // Fallback name for error
        }),
    )

    // Wait for all patient name fetches to complete
    const patients = await Promise.all(patientPromises)
    // Create a map for quick lookup: patient_id -> patient_name
    const patientNameMap = new Map(patients.map((p) => [p.id, p.name]))

    // Map the raw exams, enriching each with the patient's name
    recentExams.value = rawExams.map((exam) => ({
      id: exam.id,
      date: new Date(exam.date).toLocaleDateString(),
      patient: patientNameMap.get(exam.patient_id) || `Paciente ID: ${exam.patient_id}`, // Get name from map, fallback to ID if not found
      type: exam.type,
      patient_id: exam.patient_id, // Include for modal to fetch patient details again if needed
      has_file: exam.has_file || false, // Include file status
    }))

    console.log('Fetched and enriched pending exams into recentExams:', recentExams.value)
  } catch (error) {
    console.error('Error fetching or enriching pending exams:', error)
    recentExams.value = [] // Set to empty array on error
  }
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

const todayIntervals = computed(() => {
  if (!businessHours.value || !Array.isArray(businessHours.value)) {
    return []
  }

  const intervals = businessHours.value.length
    ? businessHours.value
    : [{ start: '08:00', end: '20:00' }]

  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')

  const appts = [...dayAppointments.value].sort((a, b) => new Date(a.start) - new Date(b.start))
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
</script>
