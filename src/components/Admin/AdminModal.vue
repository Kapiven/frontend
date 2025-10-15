<template>
  <div class="admin-modal-overlay">
    <div class="admin-modal">
      <div class="modal-header">
        <div class="header-content">
          <h3 class="modal-title">{{ isEditing ? 'Editar Rol' : 'Crear Rol' }}</h3>
          <div class="header-meta">
            <span class="version-tag">{{ isEditing ? 'Edición' : 'Nuevo' }}</span>
            <span class="edit-badge">{{ form.role || 'Sin rol' }}</span>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn" aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-form">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input
            :value="form.name"
            @input="updateForm('name', $event.target.value)"
            type="text"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Rol</label>
          <select
            :value="form.role"
            @change="updateForm('role', $event.target.value)"
          >
            <option value="">Selecciona un rol</option>
            <option v-for="role in roleOptions" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>
      </div>

      <div class="modal-actions">
        <button @click="$emit('save')" class="btn btn-primary">Guardar</button>
        <button @click="$emit('close')" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isEditing: Boolean,
  form: Object,
  roleOptions: Array
})

const emit = defineEmits(['close', 'save', 'update-form'])

const updateForm = (field, value) => {
  const updatedForm = { ...props.form, [field]: value }
  emit('update-form', updatedForm)
}
</script>

<style scoped>
/* Gradient modal header to match Nueva Consulta */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: var(--gradient-primary);
  color: var(--color-on-primary);
}

.header-content h3 { margin: 0; color: var(--color-on-primary); }

.header-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.version-tag, .edit-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255,255,255,0.35);
  background: transparent;
  color: var(--color-on-primary);
  font-size: 0.75rem;
}

.edit-badge { background: rgba(255,255,255,0.12); }

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: 0.5rem;
  border: 1px solid rgba(255,255,255,0.35);
  background: transparent;
  color: var(--color-on-primary);
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-btn:hover { background: rgba(255,255,255,0.24); }
</style>
