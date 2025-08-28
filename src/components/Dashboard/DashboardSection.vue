<template>
  <TodayAppointments
    :title="props.titles[0]"
    :todayIntervals="props.todayIntervals"
    :formatTime="props.formatTime"
    @patientRedirect="handlePatientRedirect"
  />
  <PendingExams
    :title="props.titles[1]"
    :recentExams="props.recentExams"
    @openExamUploadModal="handleOpenExamUploadModal"
  />
  <Diagnostics
    :title="props.titles[2] || 'Diagnósticos'"
    @patientRedirect="handlePatientRedirect"
  />
  <Treatments
    :title="props.titles[3] || 'Tratamientos'"
    @patientRedirect="handlePatientRedirect"
  />
</template>

<script setup>
import TodayAppointments from './TodayAppointments.vue'
import PendingExams from './PendingExams.vue'
import Diagnostics from './Diagnostics.vue'
import Treatments from './Treatments.vue'

const emit = defineEmits(['patientRedirect', 'openExamUploadModal'])

const props = defineProps({
  todayIntervals: {
    type: Array,
    required: true,
  },
  formatTime: {
    type: Function,
    required: true,
  },
  titles: {
    type: Array,
    required: true,
  },
  recentExams: {
    type: Array,
    default: () => [],
  },
})

function handleOpenExamUploadModal(exam) {
  emit('openExamUploadModal', exam)
}

function handlePatientRedirect(patientId) {
  emit('patientRedirect', patientId)
}
</script>
