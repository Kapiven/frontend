<template>
  <div class="modal-overlay">
    <div class="modal new-consultation-modal">
      <h2>Nueva Consulta (Placeholder)</h2>
      <form>
        <!-- Valor1: I/D con interruptor S/N y comentario -->
        <div class="exam-row">
          <label class="exam-label">Valor1</label>
          <div class="eye-section">
            <span>I</span>
            <label class="switch">
              <input type="checkbox" v-model="valor1I" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ valor1I ? 'S' : 'N' }}</span>
          </div>
          <div class="eye-section">
            <span>D</span>
            <label class="switch">
              <input type="checkbox" v-model="valor1D" />
              <span class="slider"></span>
            </label>
            <span class="switch-label">{{ valor1D ? 'S' : 'N' }}</span>
          </div>
          <input class="comment-input" type="text" placeholder="Comentario" v-model="valor1Comment" />
        </div>

        <!-- Valor2: I/D con input numérico y comentario -->
        <div class="exam-row">
          <label class="exam-label">Valor2</label>
          <div class="eye-section">
            <span>I</span>
            <input class="number-input" type="number" v-model="valor2I" />
          </div>
          <div class="eye-section">
            <span>D</span>
            <input class="number-input" type="number" v-model="valor2D" />
          </div>
          <input class="comment-input" type="text" placeholder="Comentario" v-model="valor2Comment" />
        </div>

        <!-- Valor3: solo interruptor S/N y comentario -->
        <div class="exam-row">
          <label class="exam-label">Valor3</label>
          <label class="switch">
            <input type="checkbox" v-model="valor3" />
            <span class="slider"></span>
          </label>
          <span class="switch-label">{{ valor3 ? 'S' : 'N' }}</span>
          <input class="comment-input" type="text" placeholder="Comentario" v-model="valor3Comment" />
        </div>

        <!-- Valor4: solo input numérico y comentario -->
        <div class="exam-row">
          <label class="exam-label">Valor4</label>
          <input class="number-input" type="number" v-model="valor4" />
          <input class="comment-input" type="text" placeholder="Comentario" v-model="valor4Comment" />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-primary" @click="$emit('close')">Cerrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const valor1I = ref(false)
const valor1D = ref(false)
const valor1Comment = ref('')
const valor2I = ref('')
const valor2D = ref('')
const valor2Comment = ref('')
const valor3 = ref(false)
const valor3Comment = ref('')
const valor4 = ref('')
const valor4Comment = ref('')
</script>

<!-- styles moved to patientpage.css -->
