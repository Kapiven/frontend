<template>
  <div class="fixed inset-0 modal-bg flex items-center justify-center z-50">
    <div class="modal-card">
      <h3 class="text-xl font-semibold mb-4">
        {{ isEditing ? 'Editar Rol' : 'Crear Rol' }}
      </h3>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          :value="form.name"
          @input="updateForm('name', $event.target.value)"
          type="text"
          class="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          :value="form.role"
          @change="updateForm('role', $event.target.value)"
          class="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Selecciona un rol</option>
          <option v-for="role in roleOptions" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>

      <div class="flex justify-end gap-3">
        <button @click="$emit('close')"
                class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Cancelar
        </button>
        <button @click="$emit('save')" class="btn-primary">
          Guardar
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
