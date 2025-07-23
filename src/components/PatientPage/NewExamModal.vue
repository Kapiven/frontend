<template>
  <div class="modal-overlay">
    <div class="modal new-exam-modal">
      <h2>Subir Nuevo Examen</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Campo: Nombre del Examen -->
        <div class="form-group">
          <label class="form-label">Nombre del Examen*</label>
          <input
            type="text"
            v-model="examName"
            class="form-input"
            placeholder="Ej: Analítica completa, Radiografía, etc."
            required
          />
        </div>

        <!-- Campo: ID del Paciente (automático) -->
        <div class="form-group">
          <label class="form-label">Paciente</label>
          <input
            type="text"
            :value="patientId"
            class="form-input"
            disabled
          />
        </div>

        <!-- Campo: Asociar a Consulta (requerido) -->
        <div class="form-group">
          <label class="form-label">Consulta Asociada*</label>
          <select 
            v-model="associatedConsultation" 
            class="form-input"
            required
          >
            <option 
              v-for="consultation in consultations" 
              :key="consultation.id" 
              :value="consultation.id"
            >
              {{ consultation.reason }} - {{ formattedDate(consultation.date) }}
            </option>
          </select>
        </div>

        <!-- Campo: Fecha del Examen -->
        <div class="form-group">
          <label class="form-label">Fecha del Examen*</label>
          <input
            type="date"
            v-model="examDate"
            class="form-input"
            :max="new Date().toISOString().split('T')[0]"
            required
          />
        </div>

        <!-- Campo: Subir Documento -->
        <div class="form-group">
          <label class="form-label">Documento del Examen*</label>
          <div class="file-upload">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              required
            />
            <div class="file-info" v-if="selectedFile">
              {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
            </div>
            <button
              type="button"
              class="btn-select-file"
              @click="$refs.fileInput.click()"
            >
              Seleccionar Archivo
            </button>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="modal-actions">
          <button type="submit" class="btn-primary" :disabled="uploading">
            {{ uploading ? 'Subiendo...' : 'Guardar Examen' }}
          </button>
          <button
            type="button"
            class="btn-secondary"
            @click="$emit('close')"
            :disabled="uploading"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const emit = defineEmits(['save-exam', 'close'])

// Props recibidos
const props = defineProps({
  patientId: {
    type: String,
    required: true
  },
  consultations: {
    type: Array,
    required: true,
    validator: (value) => value.length > 0 // Asegura que haya consultas disponibles
  }
})

// Datos del formulario
const examName = ref('')
const associatedConsultation = ref(props.consultations[0]?.id || '') // Selecciona la primera consulta por defecto
const examDate = ref(new Date().toISOString().split('T')[0])
const selectedFile = ref(null)
const uploading = ref(false)
const fileInput = ref(null)

// Métodos
const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formattedDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const handleSubmit = async () => {
  if (!selectedFile.value) {
    alert('Por favor seleccione un archivo')
    return
  }

  uploading.value = true

  try {
    const newExam = {
      id: Date.now().toString(),
      name: examName.value,
      patientId: props.patientId,
      consultationId: associatedConsultation.value, // Campo requerido
      date: examDate.value,
      file: selectedFile.value,
      fileSize: selectedFile.value.size,
      uploadedAt: new Date().toISOString()
    }

    emit('save-exam', newExam)
    emit('close')
  } catch (error) {
    console.error('Error al subir el examen:', error)
    alert('Error al subir el examen. Por favor intente nuevamente.')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
/* Estilos se mantienen igual */
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

.file-upload {
  margin-top: 5px;
}

.file-upload input[type="file"] {
  display: none;
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
  background-color: #4CAF50;
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
</style>