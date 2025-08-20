<template>
  <div class="exams-section">
    <div class="section-header">
      <h2>Exámenes</h2>
      <div class="filter-section">
        <select v-model="selectedFilter" class="exam-filter">
          <option value="">Todos los tipos</option>
          <option v-for="type in uniqueExamTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>

    <div class="exams-list">
      <div
        v-for="exam in filteredExams"
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

      <p v-if="filteredExams.length === 0 && exams.length > 0" class="no-results">
        No hay exámenes del tipo seleccionado.
      </p>

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
import { ref, computed } from 'vue'
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
  emits: ['add-exam', 'openExamUploadModal'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const loadingExamId = ref(null)
    const errorDownloading = ref(null)
    const selectedFilter = ref('') // Add filter state

    // Computed property for unique exam types
    const uniqueExamTypes = computed(() => {
      const types = props.exams.map((exam) => exam.type).filter(Boolean)
      return [...new Set(types)].sort()
    })

    // Computed property for filtered exams
    const filteredExams = computed(() => {
      if (!selectedFilter.value) {
        return props.exams
      }
      return props.exams.filter((exam) => exam.type === selectedFilter.value)
    })

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

    const openUploadModal = (exam) => {
      console.log('Opening upload modal for exam:', exam)
      emit('openExamUploadModal', exam)
    }

    const selectExam = async (exam) => {
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
      openUploadModal,
      loadingExamId,
      errorDownloading,
      selectedFilter, // Add to return
      uniqueExamTypes, // Add to return
      filteredExams, // Add to return
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
  background-color: var(--color-table-row-hover);
}

.exam-name {
  font-weight: bold;
}

.exam-date,
.exam-type {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
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
  background-color: var(--color-table-row-hover);
}

.exam-item.no-file {
  background-color: var(--color-background-mute);
  opacity: 0.8;
}

.exam-item.no-file:hover {
  background-color: var(--color-table-row-hover);
}

.exam-info {
  flex: 1;
}

.exam-actions {
  display: flex;
  align-items: center;
}

.add-file-btn {
  background: var(--color-btn);
  color: var(--color-btn-text);
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.add-file-btn:hover {
  background: var(--color-btn-hover);
}

.file-available {
  font-size: 1.2rem;
  color: var(--color-success);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.filter-section {
  display: flex;
  align-items: center;
}

.exam-filter {
  padding: 5px 10px;
  border: 1px solid var(--color-input-border);
  border-radius: 4px;
  background-color: var(--color-input-bg);
  color: var(--color-input-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.exam-filter:focus {
  outline: none;
  border-color: var(--color-input-border-focus);
  box-shadow: var(--shadow-focus);
}

.no-results {
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
  padding: 20px;
}
</style>
