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
              <button type="button" class="btn-download" @click="downloadExam">
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
            <button type="button" class="btn-select-file" @click="$refs.fileInput.click()">
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
            class="btn-primary"
            @click="uploadFile"
            :disabled="uploading || !selectedFile"
          >
            {{ uploading ? 'Subiendo...' : 'Subir Documento' }}
          </button>
          <button type="button" class="btn-secondary" @click="$emit('close')" :disabled="uploading">
            Cerrar
          </button>
        </div>
      </div>
      <div v-else>
        <p>No se ha seleccionado ningún examen para mostrar.</p>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cerrar</button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.file-upload-section p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
}

.file-info-section {
  margin-top: 10px;
  padding: 10px;
  background-color: #e6f7ff;
  border: 1px solid #b3e0ff;
  border-radius: 4px;
}

.btn-download {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  transition: background-color 0.2s ease;
}
.btn-download:hover {
  background-color: #0056b3;
}

.btn-select-file {
  background-color: #f0f0f0;
  color: #333;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-select-file:hover {
  background-color: #e0e0e0;
}

.file-info {
  margin-top: 8px;
  font-size: 13px;
  color: #555;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:disabled {
  background-color: #ef9a9a;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #dc3545;
  padding: 8px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.9em;
}

.success-message {
  color: #28a745;
  background-color: #d4edda;
  border: 1px solid #28a745;
  padding: 8px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.9em;
}
</style>
