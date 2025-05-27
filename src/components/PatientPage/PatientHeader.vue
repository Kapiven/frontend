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
.patient-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.patient-header h1 {
  margin: 0;
  color: #2c3e50;
}

.patient-info {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  color: #666;
}
</style>