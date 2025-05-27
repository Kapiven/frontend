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
.consultations-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.add-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-button:hover {
  background-color: #3aa876;
}

.consultations-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.consultation-item {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.consultation-item:hover {
  background-color: #f5f5f5;
}

.consultation-item:last-child {
  border-bottom: none;
}

.consultation-reason {
  font-weight: 500;
}

.consultation-date {
  color: #666;
  font-size: 14px;
}
</style>