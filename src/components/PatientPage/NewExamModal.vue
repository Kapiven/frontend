<template>
  <div class="modal-overlay">
    <div class="modal new-exam-modal">
      <h2>Nuevo Examen (Placeholder)</h2>
      <form>
        <div class="exam-row">
          <label class="exam-label">Documento del Examen</label>
          <input class="file-input" type="file" @change="handleFileChange" />
        </div>

        <div class="exam-row">
          <label class="exam-label">Comentario</label>
          <input class="comment-input" type="text" placeholder="Comentario opcional" v-model="comment" />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-primary" @click="handleSubmit">Guardar (placeholder)</button>
          <button type="button" class="btn-secondary" @click="$emit('close')">Cerrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save-exam', 'close'])

const selectedFile = ref(null)
const comment = ref('')

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const handleSubmit = () => {
  if (!selectedFile.value) {
    alert('Por favor selecciona un archivo.')
    return
  }

  const newExam = {
    id: Date.now(),
    name: selectedFile.value.name,
    date: new Date().toISOString(),
    comment: comment.value
  }

  emit('save-exam', newExam)
  emit('close')
}
</script>

<!-- Usa estilos globales desde patientpage.css -->
