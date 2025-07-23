<template>
  <div class="dashboard">
    <SearchBar
      :fetchDaySummary="fetchDaySummary"
      :patientRedirect="patientRedirect"
    />

    <div class="quick-actions">
      <button @click="calendarRedirect">Calendario</button>
      <button @click="consultRedirect">Consultas</button>
      <button @click="showExamModal = true">Añadir Examen</button>
    </div>
    
    <div class="section-wrapper">
      <DashboardSection
        :titles="['Citas de Hoy', 'Exámenes Pendientes']"
        :todayIntervals="todayIntervals"
        :formatTime="formatTime"
        @patientRedirect="patientRedirect"
        :recentExams="recentExams"
        @examRedirect="examRedirect"
      />
    </div>

    <NewExamModal
      v-if="showExamModal"
      :patient-id="selectedPatientId"
      :consultations="[]"
      @save-exam="handleSaveExam"
      @close="showExamModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './Dashboard/SearchBar.vue'
import DashboardSection from './Dashboard/DashboardSection.vue'
import NewExamModal from '@/components/PatientPage/NewExamModal.vue'
import { getBusinessHoursForDay } from '@/services/businessHoursService'
import { getAppointmentsForDate } from '@/services/appointmentService'
import "@/assets/styles/dashboard.css"

const router = useRouter()

// Estados reactivos
const showExamModal = ref(false)
const selectedPatientId = ref('')
const businessHours = ref([])
const dayAppointments = ref([])
const recentExams = ref([
  { id: 1, date: '2025-04-22', patient: 'Luis G.', type: 'Rayos X' },
  { id: 2, date: '2025-04-21', patient: 'María F.', type: 'Examen de sangre' },
  // ... (resto de los exámenes de ejemplo)
])

const todayStr = new Date().toISOString().slice(0, 10)

// Funciones de redirección
function calendarRedirect() {
  router.push('/calendar')
}

function consultRedirect() {
  alert('Redirigir a consultas...')
}

// Manejo de exámenes
function handleSaveExam(newExam) {
  recentExams.value.unshift({
    id: Date.now().toString(),
    date: newExam.date,
    patient: 'Nuevo Paciente',
    type: newExam.name,
  })
  showExamModal.value = false
}

function examRedirect(examId) {
  alert(`Redirigir a la pagina del examen con ID ${examId})`)
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