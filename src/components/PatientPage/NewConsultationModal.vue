<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2>Nueva Consulta</h2>
          <div class="header-meta">
            <span class="version-tag">{{ currentDate }}</span>
            <span class="edit-badge">{{ patientName || 'Nombre del Paciente' }}</span>
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
        <div v-if="loading" class="no-questions">
          <div class="loading-spinner"></div>
          <p>Cargando cuestionario...</p>
        </div>

        <div v-else-if="error" class="no-questions">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p>{{ error }}</p>
          <button @click="loadQuestionnaire" class="btn btn-outline btn-sm">Reintentar</button>
        </div>

        <form v-else @submit.prevent="saveConsultation">
          <div v-if="!questionnaire?.questions?.length" class="no-questions">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <p>No hay preguntas disponibles en el cuestionario activo.</p>
          </div>

          <div v-else>
            <!-- All Questions in Single List -->
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
                  Evaluación de Consulta
                  <span class="questions-count">({{ sortedQuestions.length }})</span>
                </h3>
              </div>

              <div class="questions-list">
                <div
                  v-for="question in sortedQuestions"
                  :key="question.id"
                  class="question-edit-card"
                >
                  <div class="question-number">{{ question.order }}</div>
                  <div class="question-edit-content">
                    <div class="question-edit-header">
                      <div class="question-input-group">
                        <label class="form-group-label">{{ question.name }}</label>
                        <span v-if="question.bilateral" class="question-type-badge bilateral"
                          >Bilateral</span
                        >
                        <span v-else class="question-type-badge general">General</span>
                      </div>
                    </div>
                    <div class="question-controls">
                      <!-- Bilateral Question Layout -->
                      <div v-if="question.bilateral" class="form-row">
                        <div class="bilateral-inputs">
                          <div class="control-group">
                            <label>OD (Ojo Derecho)</label>
                            <input
                              v-if="question.type === 'booleano'"
                              type="checkbox"
                              v-model="formData[question.id].od"
                              class="form-checkbox"
                              :class="{ 'input-error': validationErrors[question.id]?.od }"
                            />
                            <input
                              v-else
                              :type="getInputType(question.type)"
                              v-model="formData[question.id].od"
                              :placeholder="getPlaceholder(question.type)"
                              :step="question.type === 'float' ? '0.1' : undefined"
                              class="form-input"
                              :class="{ 'input-error': validationErrors[question.id]?.od }"
                            />
                            <div v-if="validationErrors[question.id]?.od" class="error-message">
                              {{ validationErrors[question.id].od }}
                            </div>
                          </div>
                          <div class="control-group">
                            <label>OI (Ojo Izquierdo)</label>
                            <input
                              v-if="question.type === 'booleano'"
                              type="checkbox"
                              v-model="formData[question.id].oi"
                              class="form-checkbox"
                              :class="{ 'input-error': validationErrors[question.id]?.oi }"
                            />
                            <input
                              v-else
                              :type="getInputType(question.type)"
                              v-model="formData[question.id].oi"
                              :placeholder="getPlaceholder(question.type)"
                              :step="question.type === 'float' ? '0.1' : undefined"
                              class="form-input"
                              :class="{ 'input-error': validationErrors[question.id]?.oi }"
                            />
                            <div v-if="validationErrors[question.id]?.oi" class="error-message">
                              {{ validationErrors[question.id].oi }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Non-bilateral Question Layout -->
                      <div v-else class="form-row">
                        <div class="control-group single-input">
                          <label>{{ question.type === 'booleano' ? 'Evaluación' : 'Valor' }}</label>
                          <input
                            v-if="question.type === 'booleano'"
                            type="checkbox"
                            v-model="formData[question.id].value"
                            class="form-checkbox"
                            :class="{ 'input-error': validationErrors[question.id]?.value }"
                          />
                          <input
                            v-else
                            :type="getInputType(question.type)"
                            v-model="formData[question.id].value"
                            :placeholder="getPlaceholder(question.type)"
                            :step="question.type === 'float' ? '0.1' : undefined"
                            class="form-input"
                            :class="{ 'input-error': validationErrors[question.id]?.value }"
                          />
                          <div v-if="validationErrors[question.id]?.value" class="error-message">
                            {{ validationErrors[question.id].value }}
                          </div>
                        </div>
                      </div>

                      <!-- Comment section for all questions -->
                      <div class="comment-section">
                        <label class="form-group-label">Comentario:</label>
                        <input
                          type="text"
                          v-model="formData[question.id].comment"
                          placeholder="Observaciones adicionales..."
                          class="form-input comment-input"
                        />
                      </div>
                    </div>
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
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17,21 17,13 7,13 7,21"></polyline>
                <polyline points="7,3 7,8 15,8"></polyline>
              </svg>
              {{ loading ? 'Guardando...' : 'Guardar Consulta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { questionnaireService } from '@/services/questionnaireService'

export default {
  name: 'NewConsultationModal',
  props: {
    patientName: String,
    patientId: [String, Number],
  },
  emits: ['close', 'save'],
  data() {
    return {
      questionnaire: null,
      formData: {},
      validationErrors: {},
      loading: true,
      error: null,
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    },
    sortedQuestions() {
      if (!this.questionnaire?.questions) return []
      return [...this.questionnaire.questions].sort((a, b) => (a.order || 0) - (b.order || 0))
    },
  },
  async mounted() {
    await this.loadQuestionnaire()
  },
  methods: {
    async loadQuestionnaire() {
      this.loading = true
      this.error = null

      try {
        const activeQuestionnaires = await questionnaireService.getActive()
        const consultationQuestionnaire = activeQuestionnaires.find((q) =>
          q.name.toLowerCase().includes('consulta'),
        )

        if (!consultationQuestionnaire) {
          throw new Error('No se encontró un cuestionario de consulta activo')
        }

        this.questionnaire = await questionnaireService.getWithQuestions(
          consultationQuestionnaire.id,
        )
        this.initializeFormData()
      } catch (error) {
        console.error('Error loading questionnaire:', error)
        this.error = error.message || 'Error cargando el cuestionario'
      } finally {
        this.loading = false
      }
    },

    initializeFormData() {
      if (!this.questionnaire?.questions) return

      const data = {}
      this.questionnaire.questions.forEach((question) => {
        if (question.bilateral) {
          data[question.id] = {
            od: question.type === 'booleano' ? false : '',
            oi: question.type === 'booleano' ? false : '',
            comment: '',
          }
        } else {
          data[question.id] = {
            value: question.type === 'booleano' ? false : '',
            comment: '',
          }
        }
      })
      this.formData = data
    },

    getInputType(questionType) {
      switch (questionType) {
        case 'entero':
          return 'number'
        case 'float':
          return 'number'
        default:
          return 'text'
      }
    },

    getPlaceholder(questionType) {
      switch (questionType) {
        case 'entero':
          return '0'
        case 'float':
          return '0.0'
        default:
          return 'Ingrese valor'
      }
    },

    validateForm() {
      this.validationErrors = {}
      let isValid = true

      this.questionnaire.questions.forEach((question) => {
        const questionErrors = {}
        const questionData = this.formData[question.id]

        if (question.bilateral) {
          ;['od', 'oi'].forEach((eye) => {
            const value = questionData[eye]
            const error = this.validateValue(value, question.type)
            if (error) {
              questionErrors[eye] = error
              isValid = false
            }
          })
        } else {
          const value = questionData.value
          const error = this.validateValue(value, question.type)
          if (error) {
            questionErrors.value = error
            isValid = false
          }
        }

        if (Object.keys(questionErrors).length > 0) {
          this.validationErrors[question.id] = questionErrors
        }
      })

      return isValid
    },

    validateValue(value, type) {
      if (value === '' || value === null || value === undefined) return null

      switch (type) {
        case 'entero':
          if (!Number.isInteger(Number(value)) || isNaN(Number(value))) {
            return 'Debe ser un número entero'
          }
          break
        case 'float':
          if (isNaN(Number(value))) {
            return 'Debe ser un número válido'
          }
          break
      }
      return null
    },

    async saveConsultation() {
      if (!this.validateForm()) return

      this.loading = true
      try {
        const consultationData = {
          patientId: this.patientId,
          questionnaireId: this.questionnaire.id,
          date: new Date().toISOString(),
          answers: this.formData,
        }

        console.log('Saving consultation:', consultationData)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.$emit('save', consultationData)
        this.$emit('close')
      } catch (error) {
        this.error = 'Error guardando la consulta'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* Use the exact same styles as provided */
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

/* Questions Section */
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

.question-edit-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.question-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-group-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  display: block;
  margin: 0;
}

.question-type-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.question-type-badge.bilateral {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.question-type-badge.general {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.question-controls {
  margin-top: 1rem;
}

.form-row {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.bilateral-inputs {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.single-input {
  min-width: 200px;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-width: 120px;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.comment-section {
  margin-top: 1rem;
}

.comment-input {
  width: 100%;
  min-width: 300px;
}

.error-message {
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.no-questions {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.no-questions svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Actions */
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
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

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .bilateral-inputs {
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .header-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-input-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
