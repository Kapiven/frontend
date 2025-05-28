<template>
  <div class="consultations-section">
    <div class="section-header">
      <h2>Consultas</h2>
      <button @click="$emit('add-consultation')" class="add-button">
        + Nueva Consulta
      </button>
    </div>
    
    <div class="consultations-list">
      <div 
        v-for="consultation in consultations" 
        :key="consultation.id" 
        class="consultation-item"
        @click="selectConsultation(consultation)"
      >
        <div class="consultation-reason">{{ consultation.reason }}</div>
        <div class="consultation-date">{{ formattedDate(consultation.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsultationsSection',
  props: {
    consultations: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    selectConsultation(consultation) {
      // En el futuro esto mostrará detalles de la consulta
      console.log('Consulta seleccionada:', consultation)
    }
  }
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');
</style>