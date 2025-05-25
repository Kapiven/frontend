<template>
  <div class="dashboard">
    <SearchBar
      :fetchDaySummary="fetchDaySummary"
      :patientRedirect="patientRedirect"
    />

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
        @examRedirect="examRedirect"
      />
    </div>
  </div>
</template>

<script setup>
import SearchBar from './Dashboard/SearchBar.vue'
import DashboardSection from './Dashboard/DashboardSection.vue'
import "@/assets/styles/dashboard.css"
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getBusinessHoursForDay } from '@/services/businessHoursService'
import { getAppointmentsForDate } from '@/services/appointmentService'

const router = useRouter()

const businessHours = ref([])
const dayAppointments = ref([])

const todayStr = new Date().toISOString().slice(0, 10)

function calendarRedirect() {
  router.push('/calendar')
}

function consultRedirect() {
  alert('Redirigir a consultas...')
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
  if (!businessHours.value || !Array.isArray(businessHours.value)) {
    return []
  }
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

function examRedirect(examId) {
  alert(`Redirigir a la pagina del examen con ID ${examId})`)
}

function patientRedirect(patientId) {
  alert(`Redirigir a pagina del paciente con ID ${patientId}`)
}
</script>