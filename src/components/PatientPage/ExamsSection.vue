<template>
  <div class="exams-section">
    <div class="section-header">
      <h2>Exámenes</h2>
      <button @click="showModal = true" class="add-button">
        + Añadir Examen
      </button>
    </div>
    
    <div class="exams-list">
      <div 
        v-for="exam in exams" 
        :key="exam.id" 
        class="exam-item"
        @click="selectExam(exam)"
      >
        <div class="exam-name">{{ exam.name }}</div>
        <div class="exam-date">{{ formattedDate(exam.date) }}</div>
      </div>
    </div>

    <NewExamModal 
      v-if="showModal"
      :patient-id="patientId"
      :consultations="consultations"
      @save-exam="handleSaveExam"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import NewExamModal from './NewExamModal.vue'

export default {
  name: 'ExamsSection',
  components: { NewExamModal },
  props: {
    exams: { 
      type: Array, 
      default: () => [] 
    },
    patientId: {
      type: String,
      required: true
    },
    consultations: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0
    }
  },
  setup(props, { emit }) {
    const showModal = ref(false)

    const handleSaveExam = (newExam) => {
      emit('add-exam', newExam)
    }

    const formattedDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const selectExam = (exam) => {
      console.log('Examen seleccionado:', exam)
    }

    return { showModal, handleSaveExam, formattedDate, selectExam }
  }
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');

.exam-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.exam-item:hover {
  background-color: #f5f5f5;
}

.exam-name {
  font-weight: bold;
}

.exam-date, .exam-type {
  font-size: 0.9rem;
  color: #666;
}

.exam-comment {
  font-size: 0.9rem;
  color: #555;
  margin-top: 4px;
}
</style>