<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2>Detalles de Consulta</h2>
          <div class="header-meta">
            <span class="version-tag">{{ formattedDate(consultation.date) }}</span>
            <span class="edit-badge"> Paciente #{{ consultation.patient_id || '—' }} </span>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div v-if="!consultation" class="no-questions">
          <div class="loading-spinner"></div>
          <p>Cargando consulta...</p>
        </div>

        <div v-else>
          <!-- Reason -->
          <div class="questions-section">
            <div class="section-header">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 20h9M12 4h9M4 9h16M4 15h16"></path>
                </svg>
                Motivo de la Consulta
              </h3>
            </div>
            <div class="question-edit-card">
              <div class="question-number">🩺</div>
              <div class="question-edit-content">
                <p class="form-group-label">
                  {{ consultation.reason || 'Sin motivo especificado' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Questions -->
          <div class="questions-section">
            <div class="section-header">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                  ></path>
                </svg>
                Respuestas del Cuestionario
                <span class="questions-count">({{ consultation.questions?.length || 0 }})</span>
              </h3>
            </div>

            <div v-if="!consultation.questions?.length" class="no-questions">
              <p>No hay respuestas registradas para esta consulta.</p>
            </div>

            <div v-else class="questions-list">
              <div
                v-for="(q, index) in consultation.questions"
                :key="q.id"
                class="question-edit-card"
              >
                <div class="question-number">{{ index + 1 }}</div>
                <div class="question-edit-content">
                  <div class="question-edit-header">
                    <div class="question-input-group">
                      <label class="form-group-label">Pregunta #{{ q.question_id }}</label>
                    </div>
                  </div>

                  <div class="question-controls">
                    <div v-if="q.int_values?.length" class="form-row">
                      <div class="bilateral-inputs">
                        <div class="control-group">
                          <label>OD (Ojo Derecho)</label>
                          <span class="form-input readonly">{{ q.int_values[0] }}</span>
                        </div>
                        <div class="control-group">
                          <label>OI (Ojo Izquierdo)</label>
                          <span class="form-input readonly">{{ q.int_values[1] }}</span>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="q.text_values?.length" class="form-row">
                      <div class="control-group single-input">
                        <label>Valor</label>
                        <span class="form-input readonly">{{ q.text_values.join(', ') }}</span>
                      </div>
                    </div>

                    <div
                      v-else-if="q.bool_value !== null && q.bool_value !== undefined"
                      class="form-row"
                    >
                      <div class="control-group single-input">
                        <label>Valor</label>
                        <span class="form-input readonly">
                          {{ q.bool_value ? 'Sí' : 'No' }}
                        </span>
                      </div>
                    </div>

                    <div v-if="q.comment" class="comment-section">
                      <label class="form-group-label">Comentario:</label>
                      <span class="form-input readonly">{{ q.comment }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Diagnoses -->
          <div v-if="consultation.diagnoses?.length" class="questions-section">
            <div class="section-header">
              <h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                </svg>
                Diagnósticos
              </h3>
            </div>
            <div class="questions-list">
              <div v-for="d in consultation.diagnoses" :key="d.id" class="question-edit-card">
                <div class="question-number">💊</div>
                <div class="question-edit-content">
                  <p>
                    <strong>{{ d.name }}</strong>
                  </p>
                  <p>{{ d.recommendation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="$emit('close')">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowConsultationModal',
  props: {
    consultation: Object,
  },
  emits: ['close'],
  methods: {
    formattedDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');

/* 👇 Copy this WHOLE STYLE from NewConsultationModal.vue */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
}

.header-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.version-tag,
.edit-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.version-tag {
  background: rgba(255, 255, 255, 0.15);
}

.edit-badge {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Spinner animation reused */
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Question Card styles */
.questions-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.questions-section h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.questions-section h3::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.questions-count {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-edit-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.question-edit-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.question-edit-content {
  flex: 1;
}

.form-group-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.form-input.readonly {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  display: inline-block;
  color: #2c3e50;
  min-width: 100px;
}

/* Footer Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline {
  background: white;
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.btn-outline:hover {
  background: #f8f9fa;
  border-color: #6c757d;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
