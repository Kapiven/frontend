<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2>Editar Cuestionario</h2>
          <div class="header-meta">
            <span class="version-tag">Actual: {{ questionnaire?.version || 'v1.0' }}</span>
            <span class="edit-badge">→ Nueva: {{ form.version }}</span>
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
        <form @submit.prevent="handleSubmit">
          <!-- Questionnaire Info -->
          <div class="info-section">
            <h3>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              Información del Cuestionario
            </h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre del Cuestionario</label>
                <input
                  v-model="form.name"
                  required
                  class="form-input"
                  placeholder="Ej: Consulta General"
                />
              </div>
              <div class="form-group">
                <label>Nueva Versión</label>
                <div class="version-input-group">
                  <input
                    v-model="form.version"
                    required
                    class="form-input"
                    placeholder="Ej: v2.0"
                    @input="updateVersionPreview"
                  />
                  <button
                    type="button"
                    @click="autoIncrementVersion"
                    class="version-increment-btn"
                    title="Auto incrementar"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Questions Section -->
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Preguntas del Cuestionario
                <span class="questions-count">({{ form.questions.length }})</span>
              </h3>
              <button type="button" @click="addQuestion" class="btn btn-outline btn-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Agregar Pregunta
              </button>
            </div>

            <div v-if="form.questions.length === 0" class="no-questions">
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
              <p>No hay preguntas. Haz clic en "Agregar Pregunta" para comenzar.</p>
            </div>

            <div v-else class="questions-list">
              <div
                v-for="(question, index) in form.questions"
                :key="`question-${index}`"
                class="question-edit-card"
                :class="{ 'question-error': questionErrors[index] }"
              >
                <div class="question-number">{{ question.order }}</div>
                <div class="question-edit-content">
                  <div class="question-edit-header">
                    <div class="question-input-group">
                      <input
                        v-model="question.name"
                        class="question-name-input"
                        :class="{ 'input-error': questionErrors[index]?.name }"
                        placeholder="Nombre de la pregunta"
                        required
                        @input="validateQuestion(index)"
                      />
                      <div v-if="questionErrors[index]?.name" class="error-message">
                        {{ questionErrors[index].name }}
                      </div>
                    </div>
                    <div class="question-actions">
                      <button
                        type="button"
                        @click="moveQuestion(index, -1)"
                        :disabled="index === 0"
                        class="order-btn"
                        title="Mover arriba"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polyline points="18,15 12,9 6,15"></polyline>
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="moveQuestion(index, 1)"
                        :disabled="index === form.questions.length - 1"
                        class="order-btn"
                        title="Mover abajo"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="removeQuestion(index)"
                        :disabled="form.questions.length === 1"
                        class="remove-btn"
                        title="Eliminar pregunta"
                      >
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
                      </button>
                    </div>
                  </div>
                  <div class="question-controls">
                    <div class="form-row">
                      <div class="control-group">
                        <label>Tipo</label>
                        <select v-model="question.type" class="form-select">
                          <option value="texto">Texto</option>
                          <option value="entero">Número</option>
                          <option value="float">Número Decimal</option>
                          <option value="booleano">Sí/No</option>
                        </select>
                      </div>
                      <div class="control-group">
                        <label class="checkbox-label">
                          <input
                            type="checkbox"
                            v-model="question.bilateral"
                            class="form-checkbox"
                          />
                          <span class="checkbox-text">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                              ></path>
                            </svg>
                            Bilateral
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="btn btn-outline">
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
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
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
              Crear Nueva Versión
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questionnaire: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      form: {
        name: '',
        version: '',
        questions: [],
      },
      questionErrors: {},
    }
  },
  computed: {
    isFormValid() {
      const hasName = this.form.name.trim().length > 0
      const hasVersion = this.form.version.trim().length > 0
      const hasQuestions = this.form.questions.length > 0
      const allQuestionsValid = this.form.questions.every((q) => q.name.trim().length > 0)

      return hasName && hasVersion && hasQuestions && allQuestionsValid
    },
  },
  created() {
    // Initialize as soon as the component is created
    this.initializeForm()
  },
  mounted() {
    // Also initialize when mounted, in case prop changed
    this.initializeForm()
  },
  watch: {
    questionnaire: {
      handler(newVal, oldVal) {
        console.log('Questionnaire changed:', newVal) // Debug log
        if (newVal && Object.keys(newVal).length > 0) {
          this.initializeForm()
        }
      },
      deep: true,
      immediate: true, // This ensures it runs immediately if questionnaire is already set
    },
  },
  methods: {
    initializeForm() {
      console.log('Initializing form with questionnaire:', this.questionnaire) // Debug log

      if (!this.questionnaire || Object.keys(this.questionnaire).length === 0) {
        console.log('No questionnaire data available')
        return
      }

      // Get questions from the questionnaire
      let questions = []
      if (this.questionnaire.questions && Array.isArray(this.questionnaire.questions)) {
        questions = this.questionnaire.questions
      } else if (this.questionnaire.preguntas && Array.isArray(this.questionnaire.preguntas)) {
        // Sometimes the property might be in Spanish
        questions = this.questionnaire.preguntas
      }

      console.log('Found questions:', questions) // Debug log

      this.form = {
        name: this.questionnaire.name || this.questionnaire.nombre || '',
        version: this.generateNextVersion(this.questionnaire.version || this.questionnaire.version),
        questions: this.prepareQuestions(questions),
      }

      // Clear any previous errors
      this.questionErrors = {}

      console.log('Form initialized:', this.form) // Debug log
    },

    generateNextVersion(currentVersion) {
      if (!currentVersion) return 'v1.0'

      const match = currentVersion.match(/v?(\d+)\.(\d+)/)
      if (match) {
        const major = parseInt(match[1])
        const minor = parseInt(match[2])
        return `v${major}.${minor + 1}`
      }

      return 'v2.0'
    },

    autoIncrementVersion() {
      this.form.version = this.generateNextVersion(this.form.version)
    },

    updateVersionPreview() {
      // This could trigger reactive updates in the header
    },

    prepareQuestions(questions) {
      console.log('Preparing questions:', questions) // Debug log

      if (!Array.isArray(questions) || questions.length === 0) {
        console.log('No questions to prepare or questions is not an array')
        return []
      }

      const prepared = questions.map((q, index) => {
        // Handle different possible property names
        const questionData = {
          id: q.id || null,
          name: q.name || q.nombre || q.pregunta || '',
          type: q.type || q.tipo || 'texto',
          bilateral: Boolean(q.bilateral),
          order: q.order || q.orden || index + 1,
        }
        console.log(`Prepared question ${index}:`, questionData) // Debug log
        return questionData
      })

      console.log('All prepared questions:', prepared) // Debug log
      return prepared
    },

    // ... rest of your methods remain the same
    addQuestion() {
      const newOrder = this.form.questions.length + 1
      this.form.questions.push({
        id: null,
        name: '',
        type: 'texto',
        bilateral: false,
        order: newOrder,
      })
    },

    removeQuestion(index) {
      if (this.form.questions.length > 1) {
        this.form.questions.splice(index, 1)
        this.reorderQuestions()
        // Remove error for this question
        this.$delete(this.questionErrors, index)
        // Reindex remaining errors
        this.reindexErrors(index)
      }
    },

    moveQuestion(index, direction) {
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= this.form.questions.length) return

      // Make a shallow copy of the array
      const updatedQuestions = [...this.form.questions]

      // Swap the two questions
      const temp = updatedQuestions[index]
      updatedQuestions[index] = updatedQuestions[newIndex]
      updatedQuestions[newIndex] = temp

      // Reassign to trigger Vue reactivity
      this.form.questions = updatedQuestions

      // Reorder order values
      this.reorderQuestions()
    },

    reorderQuestions() {
      this.form.questions.forEach((q, i) => {
        q.order = i + 1
      })
    },

    reindexErrors(removedIndex) {
      const newErrors = {}
      Object.keys(this.questionErrors).forEach((key) => {
        const index = parseInt(key)
        if (index < removedIndex) {
          newErrors[index] = this.questionErrors[key]
        } else if (index > removedIndex) {
          newErrors[index - 1] = this.questionErrors[key]
        }
      })
      this.questionErrors = newErrors
    },

    validateQuestion(index) {
      const question = this.form.questions[index]
      const errors = {}

      if (!question.name.trim()) {
        errors.name = 'El nombre de la pregunta es requerido'
      } else if (question.name.trim().length < 3) {
        errors.name = 'El nombre debe tener al menos 3 caracteres'
      }

      if (Object.keys(errors).length > 0) {
        this.$set(this.questionErrors, index, errors)
      } else {
        this.$delete(this.questionErrors, index)
      }
    },

    handleSubmit() {
      // Validate all questions
      this.form.questions.forEach((_, index) => {
        this.validateQuestion(index)
      })

      if (!this.isFormValid) {
        return
      }

      this.$emit('save', {
        ...this.form,
        originalId: this.questionnaire?.id,
      })
    },
  },
}
</script>

<style scoped>
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

/* Form Sections */
.info-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.info-section h3,
.questions-section h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-section h3::before {
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

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
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

.version-input-group {
  display: flex;
  gap: 0.5rem;
}

.version-increment-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.version-increment-btn:hover {
  background: #5a6fd8;
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

.question-error {
  border-color: #dc3545;
  background: #fdf2f2;
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
}

.question-name-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.question-name-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.question-actions {
  display: flex;
  gap: 0.25rem;
  align-items: flex-start;
}

.order-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-btn:hover:not(:disabled) {
  background: #5a6268;
}

.order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover:not(:disabled) {
  background: #c82333;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.question-controls {
  margin-top: 1rem;
}

.form-row {
  display: flex;
  gap: 2rem;
  align-items: center;
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

.form-select {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  min-width: 140px;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  padding: 0.5rem 0;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 0.375rem;
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
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .question-edit-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-actions {
    align-self: flex-end;
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
