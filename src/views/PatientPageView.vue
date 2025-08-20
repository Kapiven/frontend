<script setup>
import PatientPage from '../components/PatientPage.vue'

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true,
  },
})

console.log('🔍 PatientPageView: Received patientId prop:', props.patientId, typeof props.patientId)
</script>

<template>
  <main>
    <PatientPage :patientId="props.patientId" />
  </main>
</template>
