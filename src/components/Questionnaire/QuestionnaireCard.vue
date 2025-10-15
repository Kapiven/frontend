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
  border: 1px solid var(--color-card-border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--color-card-bg);
  transition: all 0.2s ease;
}

.questionnaire-card:hover { box-shadow: 0 2px 8px var(--color-card-shadow); }

.questionnaire-card.compact {
  padding: 0.75rem;
}

.inactive {
  opacity: 0.7;
  background: var(--color-background-soft);
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
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
}

.id-badge {
  background: var(--color-btn-secondary);
  color: var(--color-btn-secondary-text);
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
  background: rgba(212, 237, 218, 0.25);
  color: var(--color-success);
}

.status:not(.active) {
  background: rgba(248, 215, 218, 0.25);
  color: var(--color-error);
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

/* Use global .btn variants */
</style>
