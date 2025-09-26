<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2>{{ questionnaire.name }}</h2>
          <div class="header-meta">
            <span class="version-tag">Versión {{ questionnaire.version }}</span>
            <span class="status-tag" :class="{ active: questionnaire.active }">
              {{ questionnaire.active ? 'Activo' : 'Inactivo' }}
            </span>
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
        <!-- Questions -->
        <div class="questions-section">
          <h3>Preguntas del Cuestionario</h3>

          <div
            v-if="!questionnaire.questions || questionnaire.questions.length === 0"
            class="no-questions"
          >
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
            <p>No se encontraron preguntas para este cuestionario</p>
          </div>

          <div v-else class="questions-list">
            <div
              v-for="question in questionnaire.questions"
              :key="question.id"
              class="question-card"
            >
              <div class="question-number">{{ question.order }}</div>
              <div class="question-content">
                <h4 class="question-title">{{ question.name }}</h4>
                <div class="question-meta">
                  <span class="type-badge" :class="getTypeBadgeClass(question.type)">
                    {{ getQuestionTypeLabel(question.type) }}
                  </span>
                  <span v-if="question.bilateral" class="bilateral-badge">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questionnaire: Object,
  },
  emits: ['close'],
  methods: {
    getQuestionTypeLabel(type) {
      const typeLabels = {
        entero: 'Número',
        float: 'Número Decimal',
        texto: 'Texto',
        booleano: 'Sí/No',
        boolean: 'Sí/No',
        string: 'Texto',
        int: 'Número',
        varchar: 'Texto',
      }
      return typeLabels[type?.toLowerCase()] || type || 'Desconocido'
    },

    getTypeBadgeClass(type) {
      const typeClasses = {
        entero: 'type-number',
        int: 'type-number',
        float: 'type-decimal',
        texto: 'type-text',
        string: 'type-text',
        varchar: 'type-text',
        booleano: 'type-boolean',
        boolean: 'type-boolean',
      }
      return typeClasses[type?.toLowerCase()] || 'type-default'
    },
  },
}
</script>

<style scoped>
/* Keep all the same styles as before, just without .stats-section styles */
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
  max-width: 900px;
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
  gap: 1rem;
  align-items: center;
}

.version-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(248, 215, 218, 0.9);
  color: #721c24;
}

.status-tag.active {
  background: rgba(212, 237, 218, 0.9);
  color: #155724;
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

.questions-section h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
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

.no-questions {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.no-questions svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-questions p {
  font-size: 1.1rem;
  margin: 0;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.question-card:hover {
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

.question-content {
  flex: 1;
}

.question-title {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.question-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.type-number {
  background: #e3f2fd;
  color: #1565c0;
}

.type-decimal {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-text {
  background: #e8f5e8;
  color: #2e7d32;
}

.type-boolean {
  background: #fff3e0;
  color: #f57c00;
}

.type-default {
  background: #e9ecef;
  color: #495057;
}

.bilateral-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #dc3545;
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
