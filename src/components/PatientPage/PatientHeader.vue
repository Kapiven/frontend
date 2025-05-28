<template>
  <div class="patient-header">
    <h1>{{ patient.name }}</h1>
    <div class="patient-info">
      <span><strong>Fecha de nacimiento:</strong> {{ formattedBirthDate }}</span>
      <span><strong>Sexo:</strong> {{ patient.gender }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientHeader',
  props: {
    patient: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedBirthDate() {
      return new Date(this.patient.birthDate).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');
</style>