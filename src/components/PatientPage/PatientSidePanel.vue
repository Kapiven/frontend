<template>
  <div class="side-panel">
    <div class="panel-section">
      <h3>Información de Contacto</h3>
      <p><strong>Teléfono:</strong> {{ patient.phone }}</p>
    </div>
    
    <div class="panel-section">
      <h3>Antecedentes Alérgicos</h3>
      <p>{{ patient.allergies || 'No registra' }}</p>
    </div>
    
    <div class="panel-section">
      <h3>Antecedentes Oculares</h3>
      <p>{{ patient.ocularHistory || 'No registra' }}</p>
    </div>
    
    <div class="panel-section">
      <h3>Antecedentes Médicos</h3>
      <p>{{ patient.medicalHistory || 'No registra' }}</p>
    </div>
    
    <div class="panel-section">
      <h3>Antecedentes Familiares</h3>
      <p>{{ patient.familyHistory || 'No registra' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientSidePanel',
  props: {
    patient: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');
</style>