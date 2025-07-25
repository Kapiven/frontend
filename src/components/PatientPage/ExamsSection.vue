<template>
  <div class="exams-section">
    <div class="section-header">
      <h2>Exámenes</h2>
    </div>

    <div class="exams-list">
      <div
        v-for="exam in exams"
        :key="exam.id"
        class="exam-item"
        :class="{ 'no-file': !exam.has_file }"
        @click="selectExam(exam)"
      >
        <div class="exam-info">
          <div class="exam-name">{{ exam.type }}</div>
          <div class="exam-date">{{ formattedDate(exam.date) }}</div>
        </div>

        <div class="exam-actions">
          <span v-if="loadingExamId === exam.id" class="loading-spinner"></span>
          <button
            v-else-if="!exam.has_file"
            class="add-file-btn"
            @click.stop="openUploadModal(exam)"
          >
            Subir Archivo
          </button>
          <span v-else class="file-available">📄</span>
        </div>
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
  emits: ['add-exam', 'openExamUploadModal'], // Add this emit
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

    // New function to handle upload modal
    const openUploadModal = (exam) => {
      console.log('Opening upload modal for exam:', exam)
      emit('openExamUploadModal', exam)
    }

    // Modified selectExam function
    const selectExam = async (exam) => {
      // If exam has no file, don't try to open it
      if (!exam.has_file) {
        console.log('Exam has no file, not opening PDF')
        return
      }

      console.log('Examen seleccionado:', exam)
      errorDownloading.value = null
      loadingExamId.value = exam.id

      try {
        const downloadUrl = getExamDownloadUrl(exam.id)
        window.open(downloadUrl, '_blank')
      } catch (error) {
        console.error('Failed to open PDF:', error)
        errorDownloading.value = error.message || 'Error desconocido al abrir el archivo.'
      } finally {
        loadingExamId.value = null
      }
    }

    return {
      showModal,
      handleSaveExam,
      formattedDate,
      selectExam,
      openUploadModal, // Add this to return
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

.exam-item.no-file {
  background-color: #f8f8f8;
  opacity: 0.7;
}

.exam-item.no-file:hover {
  background-color: #e8e8e8;
}

.exam-info {
  flex: 1;
}

.exam-actions {
  display: flex;
  align-items: center;
}

.add-file-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.add-file-btn:hover {
  background-color: #0056b3;
}

.file-available {
  font-size: 1.2rem;
  color: #28a745;
}
</style>
