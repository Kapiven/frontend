<template>
  <div class="exams-section">
    <div class="section-header">
      <h2>Exámenes</h2>
      <button @click="$emit('add-exam')" class="add-button">
        + Añadir Examen
      </button>
    </div>
    
    <div class="exams-list">
      <div 
        v-for="exam in exams" 
        :key="exam.id" 
        class="exam-item"
      >
        <div class="exam-name">{{ exam.name }}</div>
        <div class="exam-date">{{ formattedDate(exam.date) }}</div>
        <div class="exam-comment" v-if="exam.comment">📝 {{ exam.comment }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamsSection',
  props: {
    exams: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');

.exam-comment {
  font-size: 0.9rem;
  color: #555;
  margin-top: 4px;
}
</style>
