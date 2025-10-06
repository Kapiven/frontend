<template>
  <div class="questionnaire-card" :class="{ inactive: !questionnaire.active, compact }">
    <div class="card-header">
      <div class="version-info">
        <span class="version-badge">{{ questionnaire.version }}</span>
        <span class="id-badge">ID: {{ questionnaire.id }}</span>
      </div>
      <span class="status" :class="{ active: questionnaire.active }">
        {{ questionnaire.active ? 'Activo' : 'Inactivo' }}
      </span>
    </div>

    <div class="card-actions">
      <button @click="$emit('view-details')" class="btn btn-outline btn-sm">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Ver Preguntas
      </button>

      <button @click="$emit('edit')" class="btn btn-primary btn-sm">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4Z"></path>
        </svg>
        Editar
      </button>

      <button
        @click="$emit('toggle-active')"
        :class="questionnaire.active ? 'btn btn-warning btn-sm' : 'btn btn-success btn-sm'"
      >
        <svg
          v-if="questionnaire.active"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        {{ questionnaire.active ? 'Desactivar' : 'Activar' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questionnaire: Object,
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'toggle-active', 'view-details'],
}
</script>

<style scoped>
.questionnaire-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  transition: all 0.2s ease;
}

.questionnaire-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.questionnaire-card.compact {
  padding: 0.75rem;
}

.inactive {
  opacity: 0.7;
  background: #f8f9fa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.version-info {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.version-badge {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
}

.id-badge {
  background: #6c757d;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.status {
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status:not(.active) {
  background: #f8d7da;
  color: #721c24;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  white-space: nowrap;
  min-height: 36px;
}

.btn-sm svg {
  flex-shrink: 0;
}

/* Ensure consistent button styling */
.btn {
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}
</style>
