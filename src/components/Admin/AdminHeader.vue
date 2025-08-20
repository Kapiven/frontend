

<template>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">Gestión de Roles</h2>
    <button @click="$emit('create-role')" class="btn-primary">
      + Añadir Rol
    </button>
  </div>
</template>

<script setup>
defineEmits(['create-role'])
</script>
