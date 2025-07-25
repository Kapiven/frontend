<template>
  <div class="exams-section">
    <div class="section-header">
      <h2>Exámenes</h2>
      <button @click="showModal = true" class="add-button">+ Añadir Examen</button>
    </div>

    <div class="exams-list">
      <div v-for="exam in exams" :key="exam.id" class="exam-item" @click="selectExam(exam)">
        <!-- Reverted to exam.name as per your patientService.js mapping -->
        <div class="exam-name">{{ exam.name }}</div>
        <div class="exam-date">{{ formattedDate(exam.date) }}</div>
        <span v-if="loadingExamId === exam.id" class="loading-spinner"></span>
      </div>
      <p v-if="errorDownloading" class="error-message">
        Error al obtener el archivo: {{ errorDownloading }}
      </p>
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
import { getExamDownloadUrl } from '@/services/examService'

export default {
  name: 'ExamsSection',
  components: { NewExamModal },
  props: {
    exams: {
      type: Array,
      default: () => [],
    },
    patientId: {
      type: String,
      required: true,
    },
    consultations: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0,
    },
  },
  setup(props, { emit }) {
    const showModal = ref(false)
    const loadingExamId = ref(null)
    const errorDownloading = ref(null)

    const handleSaveExam = (newExam) => {
      emit('add-exam', newExam)
    }

    const formattedDate = (dateString) => {
      if (!dateString) return ''
      try {
        return new Date(dateString).toLocaleDateString()
      } catch (e) {
        console.error('Invalid date string:', dateString, e)
        return dateString
      }
    }

    const selectExam = async (exam) => {
      console.log('Examen seleccionado:', exam)
      errorDownloading.value = null
      loadingExamId.value = exam.id

      try {
        const downloadUrl = await getExamDownloadUrl(exam.id)

        if (downloadUrl) {
          window.open(downloadUrl, '_blank')
        } else {
          console.warn('No download URL found for exam:', exam.id)
          errorDownloading.value = 'Archivo no disponible.'
        }
      } catch (error) {
        console.error('Failed to get download URL or open PDF:', error)
        errorDownloading.value = error.message || 'Error desconocido al descargar el archivo.'
      } finally {
        loadingExamId.value = null
      }
    }

    return {
      showModal,
      handleSaveExam,
      formattedDate,
      selectExam,
      loadingExamId,
      errorDownloading,
    }
  },
}
</script>

<style scoped>
/* Styles remain unchanged */
@import url('@/assets/styles/patientpage.css');

.exam-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam-item:hover {
  background-color: #f5f5f5;
}

.exam-name {
  font-weight: bold;
}

.exam-date,
.exam-type {
  font-size: 0.9rem;
  color: #666;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  animation: spin 1s linear infinite;
  margin-left: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: red;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid red;
  background-color: #ffebeb;
  border-radius: 4px;
}
</style>
