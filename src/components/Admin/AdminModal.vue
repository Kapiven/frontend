<template>
  <div class="admin-modal-overlay">
    <div class="admin-modal">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isEditing ? 'Editar Rol' : 'Crear Rol' }}
        </h3>
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
        <button @click="$emit('save')" class="btn-primary">
          Guardar
        </button>
        <button @click="$emit('close')" class="btn-cancel">
          Cancelar
        </button>
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
