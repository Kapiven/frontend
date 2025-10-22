<template>
  <div class="table-responsive">
    <table class="min-w-full table-auto border-collapse">
      <thead class="bg-gray-100 text-center">
        <tr>
          <th class="py-3 px-4 text-sm text-gray-700 font-medium text-center">Nombre</th>
          <th class="py-3 px-4 text-sm text-gray-700 font-medium text-center">Rol</th>
          <th class="py-3 px-4 text-sm text-gray-700 font-medium text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b hover:bg-gray-50 text-center"
        >
          <td class="py-3 px-4 text-gray-800 text-center">{{ user.name }}</td>
          <td class="py-3 px-4 text-gray-800 text-center">{{ user.role }}</td>
          <td class="py-3 px-4 text-center">
            <div class="flex justify-center gap-4">
              <button @click="$emit('edit-user', user)" class="btn-action-edit">
                Editar
              </button>
              <button @click="$emit('delete-user', user.id)" class="btn-action-delete">
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  users: Array
})

defineEmits(['edit-user', 'delete-user'])
</script>
