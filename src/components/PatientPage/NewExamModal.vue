<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal new-exam-modal">
      <h2>Detalles y Subir Documento de Examen</h2>

      <!-- Display Exam Details -->
      <div v-if="selectedExam">
        <div class="form-group">
          <label class="form-label">Tipo de Examen</label>
          <input type="text" :value="selectedExam.type" class="form-input" disabled />
        </div>

        <!-- Display Patient Name -->
        <div class="form-group">
          <label class="form-label">Paciente</label>
          <input type="text" :value="patientName || 'Cargando...'" class="form-input" disabled />
        </div>

        <!-- Download Existing File / Upload New File -->
        <div class="form-group">
          <label class="form-label">Documento del Examen</label>
          <div v-if="selectedExam.has_file" class="file-info-section">
            <p>
              Archivo subido.
                          <button type="button" class="btn btn-download btn-standard" @click="downloadExam">
              Descargar PDF
            </button>
            </p>
          </div>
          <div v-else class="file-upload-section">
            <p>No hay archivo subido. Suba uno ahora:</p>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="application/pdf"
              style="display: none"
            />
            <button type="button" class="btn btn-select-file btn-standard" @click="$refs.fileInput.click()">
              Seleccionar Archivo
            </button>
            <div class="file-info" v-if="selectedFile">
              {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
            </div>
            <p v-if="uploadError" class="error-message">{{ uploadError }}</p>
            <p v-if="uploadSuccess" class="success-message">¡Archivo subido exitosamente!</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button
            v-if="!selectedExam.has_file"
            type="submit"
            class="btn btn-primary btn-standard"
            @click="uploadFile"
            :disabled="uploading || !selectedFile"
          >
            {{ uploading ? 'Subiendo...' : 'Subir Documento' }}
          </button>
          <button type="button" class="btn btn-secondary btn-standard" @click="$emit('close')" :disabled="uploading">
            Cerrar
          </button>
        </div>
      </div>
      <div v-else>
        <p>No se ha seleccionado ningún examen para mostrar.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary btn-standard" @click="$emit('close')">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getExamDownloadUrl, uploadExamPdf } from '@/services/examService'
import { getPatientById } from '@/services/patientService'

const emit = defineEmits(['close', 'examUpdated'])

const props = defineProps({
  selectedExam: {
    type: Object,
    default: null,
  },
})

// Reactive states
const selectedFile = ref(null)
const uploading = ref(false)
const fileInput = ref(null)
const uploadError = ref(null)
const uploadSuccess = ref(false)
const patientName = ref('')

// Watch for changes in selectedExam prop to fetch patient details and reset upload state
watch(
  () => props.selectedExam,
  async (newVal) => {
    if (newVal) {
      // Reset file upload state when a new exam is selected
      selectedFile.value = null
      uploading.value = false
      uploadError.value = null
      uploadSuccess.value = false
      patientName.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }

      // Fetch patient name
      if (newVal.patient_id) {
        try {
          const patient = await getPatientById(newVal.patient_id)
          patientName.value = patient.name || `Paciente ID: ${newVal.patient_id}`
        } catch (error) {
          console.error('Error fetching patient details:', error)
          patientName.value = `Paciente ID: ${newVal.patient_id}`
        }
      }
    }
  },
  { immediate: true },
)

// Methods
const handleFileChange = (e) => {
  uploadError.value = null
  uploadSuccess.value = false
  if (e.target.files.length > 0) {
    const file = e.target.files[0]
    if (file.type !== 'application/pdf') {
      uploadError.value = 'Solo se permiten archivos PDF.'
      selectedFile.value = null
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      uploadError.value = 'El archivo es demasiado grande (máx 10MB).'
      selectedFile.value = null
      return
    }
    selectedFile.value = file
  } else {
    selectedFile.value = null
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFile = async () => {
  if (!selectedFile.value || !props.selectedExam || !props.selectedExam.id) {
    uploadError.value =
      'Por favor, selecciona un archivo y asegúrate de que un examen esté seleccionado.'
    return
  }

  uploading.value = true
  uploadError.value = null
  uploadSuccess.value = false

  try {
    await uploadExamPdf(props.selectedExam.id, selectedFile.value)
    uploadSuccess.value = true
    emit('examUpdated', props.selectedExam.id)
  } catch (error) {
    uploadError.value = error.message || 'Error al subir el archivo.'
    console.error('Upload failed:', error)
  } finally {
    uploading.value = false
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
const downloadExam = async () => {
  if (!props.selectedExam || !props.selectedExam.id) {
    console.warn('No exam selected for download.')
    return
  }

  try {
    // Simply redirect to the download endpoint
    const downloadUrl = getExamDownloadUrl(props.selectedExam.id)
    window.open(downloadUrl, '_blank')
  } catch (error) {
    console.error('Error during download:', error)
    alert('Error al descargar el archivo: ' + (error.message || 'Error desconocido.'))
  }
}
</script>

<style scoped>
/* Same styles as before */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: var(--color-modal-bg);
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-modal);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: var(--color-heading);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-input-border);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--color-input-bg);
  color: var(--color-input-text);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-input-border-focus);
  box-shadow: var(--shadow-focus);
}

.form-input:disabled {
  background-color: var(--color-background-mute);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

.file-upload-section p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.file-info-section {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.file-info-section p {
  color: var(--color-text);
  margin: 0;
}

/* Remove local download and select-file button definitions to use global ones */
.btn-download {
  background: var(--color-btn);
  color: var(--color-btn-text);
  margin-left: 10px;
}

.btn-download:hover {
  background: var(--color-btn-hover);
}

.btn-select-file {
  background: var(--color-btn);
  color: var(--color-btn-text);
}

.btn-select-file:hover {
  background: var(--color-btn-hover);
}

.file-info {
  margin-top: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Complete button override to fix size consistency issues */
.modal-actions .btn-standard {
  /* Reset all inherited styles */
  all: unset;
  /* Apply consistent button styling */
  display: inline-block;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  /* Color styling */
  background: var(--color-btn);
  color: var(--color-btn-text);
  /* Prevent any size changes */
  min-width: 120px;
  min-height: 40px;
  max-width: none;
  max-height: none;
  width: auto;
  height: auto;
}

.modal-actions .btn-standard:hover:not(:disabled) {
  background: var(--color-btn-hover);
  color: var(--color-btn-text);
}

.modal-actions .btn-standard:disabled {
  background: var(--color-btn-disabled);
  color: var(--color-btn-disabled-text);
  cursor: not-allowed;
  /* Maintain exact same dimensions */
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  min-width: 120px;
  min-height: 40px;
}
.btn-primary:disabled {
  background-color: var(--color-btn-disabled);
  color: var(--color-btn-disabled-text);
  cursor: not-allowed;
}

.btn-secondary:disabled {
  background-color: var(--color-btn-disabled);
  color: var(--color-btn-disabled-text);
  cursor: not-allowed;
}

.error-message {
  color: var(--color-error);
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-error);
  padding: 8px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.9em;
}

.success-message {
  color: var(--color-success);
  background-color: var(--color-success-bg);
  border: 1px solid var(--color-success);
  padding: 8px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.9em;
}

/* General paragraph styling for consistency */
p {
  color: var(--color-text);
}
</style>
