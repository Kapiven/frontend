<script setup>
import PatientPage from '../components/PatientPage.vue'
import { defineProps } from 'vue'
const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true,
  },
})
</script>

<template>
  <main>
    <PatientPage :patientId="props.patientId" />
  </main>
</template>
