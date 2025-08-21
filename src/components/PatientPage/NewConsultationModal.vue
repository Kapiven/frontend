<template>
  <div class="modal-overlay">
    <div class="modal new-consultation-modal">
      <div class="consultation-header">
        <h2>Nueva Consulta</h2>
        <div class="consultation-info">
          <span>Fecha: {{ currentDate }}</span>
          <span>Paciente: {{ patientName || 'Nombre del Paciente' }}</span>
        </div>
      </div>

      <form class="consultation-form thin-scrollbar">>
        <!-- TIPO 1: Evaluación Sí/No por ojo + comentario -->
        <section class="exam-section">
          <h3 class="section-title">Evaluaciones Bilaterales (Sí/No)</h3>
          
          <!-- Examen 1: Reflejo Pupilar -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name">Reflejo Pupilar</th>
                  <th class="eye-header">OD (Ojo Derecho)</th>
                  <th class="eye-header">OI (Ojo Izquierdo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Evaluación</td>
                  <td class="eye-cell">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="examData.reflexoPupilar.od" />
                      <span class="checkmark"></span>
                      <span class="checkbox-label">{{ examData.reflexoPupilar.od ? 'Sí' : 'No' }}</span>
                    </label>
                  </td>
                  <td class="eye-cell">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="examData.reflexoPupilar.oi" />
                      <span class="checkmark"></span>
                      <span class="checkbox-label">{{ examData.reflexoPupilar.oi ? 'Sí' : 'No' }}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.reflexoPupilar.comment" 
                      placeholder="Observaciones adicionales..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Examen 2: Movimientos Oculares -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name">Movimientos Oculares</th>
                  <th class="eye-header">OD (Ojo Derecho)</th>
                  <th class="eye-header">OI (Ojo Izquierdo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Evaluación</td>
                  <td class="eye-cell">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="examData.movimientosOculares.od" />
                      <span class="checkmark"></span>
                      <span class="checkbox-label">{{ examData.movimientosOculares.od ? 'Sí' : 'No' }}</span>
                    </label>
                  </td>
                  <td class="eye-cell">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="examData.movimientosOculares.oi" />
                      <span class="checkmark"></span>
                      <span class="checkbox-label">{{ examData.movimientosOculares.oi ? 'Sí' : 'No' }}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.movimientosOculares.comment" 
                      placeholder="Observaciones adicionales..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- TIPO 2: Evaluación Valor por ojo + comentario -->
        <section class="exam-section">
          <h3 class="section-title">Mediciones Bilaterales (Valores)</h3>
          
          <!-- Examen 3: Agudeza Visual -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name">Agudeza Visual</th>
                  <th class="eye-header">OD (Ojo Derecho)</th>
                  <th class="eye-header">OI (Ojo Izquierdo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Medición</td>
                  <td class="eye-cell">
                    <input 
                      type="text" 
                      class="value-input" 
                      v-model="examData.agudezaVisual.od" 
                      placeholder="20/20"
                    />
                  </td>
                  <td class="eye-cell">
                    <input 
                      type="text" 
                      class="value-input" 
                      v-model="examData.agudezaVisual.oi" 
                      placeholder="20/20"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.agudezaVisual.comment" 
                      placeholder="Observaciones adicionales..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Examen 4: Presión Intraocular -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name">Presión Intraocular</th>
                  <th class="eye-header">OD (Ojo Derecho)</th>
                  <th class="eye-header">OI (Ojo Izquierdo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Medición (mmHg)</td>
                  <td class="eye-cell">
                    <input 
                      type="number" 
                      class="value-input" 
                      v-model="examData.presionIntraocular.od" 
                      placeholder="15"
                      step="0.1"
                    />
                  </td>
                  <td class="eye-cell">
                    <input 
                      type="number" 
                      class="value-input" 
                      v-model="examData.presionIntraocular.oi" 
                      placeholder="15"
                      step="0.1"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.presionIntraocular.comment" 
                      placeholder="Observaciones adicionales..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- TIPO 3: Evaluación Sí/No general + comentario -->
        <section class="exam-section">
          <h3 class="section-title">Evaluaciones Generales (Sí/No)</h3>
          
          <!-- Examen 5: Dolor Ocular -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name-wide">Dolor Ocular</th>
                  <th class="general-header">Evaluación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Presenta dolor</td>
                  <td class="general-cell">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="examData.dolorOcular.value" />
                      <span class="checkmark"></span>
                      <span class="checkbox-label">{{ examData.dolorOcular.value ? 'Sí' : 'No' }}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.dolorOcular.comment" 
                      placeholder="Descripción del dolor, intensidad, ubicación..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Examen 6: Visión Nocturna -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name-wide">Visión Nocturna</th>
                  <th class="general-header">Evaluación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Dificultad nocturna</td>
                  <td class="general-cell">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="examData.visionNocturna.value" />
                      <span class="checkmark"></span>
                      <span class="checkbox-label">{{ examData.visionNocturna.value ? 'Sí' : 'No' }}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.visionNocturna.comment" 
                      placeholder="Descripción de las dificultades..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- TIPO 4: Evaluación Valor general + comentario -->
        <section class="exam-section">
          <h3 class="section-title">Mediciones Generales (Valores)</h3>
          
          <!-- Examen 7: Graduación Lentes -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name-wide">Graduación de Lentes</th>
                  <th class="general-header">Medición</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Graduación requerida</td>
                  <td class="general-cell">
                    <input 
                      type="text" 
                      class="value-input-wide" 
                      v-model="examData.graduacionLentes.value" 
                      placeholder="-2.50 / +1.25"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.graduacionLentes.comment" 
                      placeholder="Tipo de lente recomendado, observaciones..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Examen 8: Tiempo de Uso Dispositivos -->
          <div class="exam-group">
            <table class="exam-table">
              <thead>
                <tr>
                  <th class="exam-name-wide">Tiempo de Uso de Dispositivos</th>
                  <th class="general-header">Medición</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="exam-name-cell">Horas diarias</td>
                  <td class="general-cell">
                    <input 
                      type="number" 
                      class="value-input-wide" 
                      v-model="examData.tiempoDispositivos.value" 
                      placeholder="8"
                      min="0"
                      max="24"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="comment-row">
                    <label class="comment-label">Comentario:</label>
                    <input 
                      type="text" 
                      class="comment-input" 
                      v-model="examData.tiempoDispositivos.comment" 
                      placeholder="Tipo de dispositivos, síntomas relacionados..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="button" class="btn-primary" @click="saveConsultation">
            Guardar Consulta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props del componente
const props = defineProps({
  patientName: {
    type: String,
    default: 'Paciente de Ejemplo'
  }
})

// Emits del componente
const emit = defineEmits(['close', 'save'])

// Fecha actual para el encabezado
const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Estructura de datos para los exámenes (datos de prueba fácilmente eliminables)
const examData = ref({
  // TIPO 1: Sí/No por ojo + comentario
  reflexoPupilar: {
    od: false,
    oi: false,
    comment: ''
  },
  movimientosOculares: {
    od: true, // Datos de prueba
    oi: true, // Datos de prueba
    comment: 'Movimientos normales en todas las direcciones'
  },
  
  // TIPO 2: Valor por ojo + comentario
  agudezaVisual: {
    od: '20/20',
    oi: '20/25',
    comment: 'Ligera disminución en ojo izquierdo'
  },
  presionIntraocular: {
    od: 15.2,
    oi: 16.1,
    comment: 'Valores dentro del rango normal'
  },
  
  // TIPO 3: Sí/No general + comentario
  dolorOcular: {
    value: false,
    comment: ''
  },
  visionNocturna: {
    value: true, // Datos de prueba
    comment: 'Dificultad para ver en condiciones de poca luz'
  },
  
  // TIPO 4: Valor general + comentario
  graduacionLentes: {
    value: '-2.50 OD / -1.75 OI',
    comment: 'Se recomienda lentes multifocales'
  },
  tiempoDispositivos: {
    value: 8,
    comment: 'Trabajo de oficina, se recomienda pausas frecuentes'
  }
})

// Función para guardar la consulta
const saveConsultation = () => {
  // TODO: Aquí se enviará la información al backend
  console.log('Guardando consulta:', examData.value)
  
  // Simular guardado exitoso
  alert('Consulta guardada exitosamente')
  
  // Emitir evento de guardado con los datos
  emit('save', {
    date: new Date().toISOString(),
    patientName: props.patientName,
    examData: examData.value
  })
  
  // Cerrar modal
  emit('close')
}

// Función para limpiar datos de prueba (útil para desarrollo)
const clearTestData = () => {
  examData.value = {
    reflexoPupilar: { od: false, oi: false, comment: '' },
    movimientosOculares: { od: false, oi: false, comment: '' },
    agudezaVisual: { od: '', oi: '', comment: '' },
    presionIntraocular: { od: '', oi: '', comment: '' },
    dolorOcular: { value: false, comment: '' },
    visionNocturna: { value: false, comment: '' },
    graduacionLentes: { value: '', comment: '' },
    tiempoDispositivos: { value: '', comment: '' }
  }
}

// Exponer función para limpiar datos (para desarrollo)
if (process.env.NODE_ENV === 'development') {
  window.clearConsultationTestData = clearTestData
}
</script>

<!-- styles moved to patientpage.css -->
