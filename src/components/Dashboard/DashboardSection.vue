<template>
  <div class="dashboard-sections">
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
  </div>
</template>

<script setup>
import TodayAppointments from './TodayAppointments.vue'
import PendingExams from './PendingExams.vue'

const emit = defineEmits(['patientRedirect', 'openExamUploadModal'])

const props = defineProps({
  todayIntervals: { type: Array, required: true },
  formatTime: { type: Function, required: true },
  titles: { type: Array, required: true },
  recentExams: { type: Array, default: () => [] },
})

function handleOpenExamUploadModal(exam) {
  emit('openExamUploadModal', exam)
}

function handlePatientRedirect(patientId) {
  emit('patientRedirect', patientId)
}
</script>

<style scoped>
/* ✅ layout-only fix — keeps your section styling intact */
.dashboard-sections {
  display: flex;
  gap: 1rem;
  align-items: flex-start; /* each keeps its own height */
  justify-content: space-between;
  flex-wrap: wrap; /* stack on smaller screens */
}

/* give them roughly half width on large screens */
.dashboard-sections > * {
  flex: 1 1 48%;
  min-width: 300px;
}

/* optional tweak for narrow screens */
@media (max-width: 768px) {
  .dashboard-sections {
    flex-direction: column;
  }
}
</style>
