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
.exams-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.add-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.add-button:hover {
  background-color: #1565c0;
}

.exams-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.exam-item {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.exam-item:hover {
  background-color: #f5f5f5;
}

.exam-item:last-child {
  border-bottom: none;
}

.exam-name {
  font-weight: 500;
}

.exam-date {
  color: #666;
  font-size: 14px;
}
</style>