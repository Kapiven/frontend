

<template>
  <div class="admin-header">
    <h2 class="admin-title">Gestión de Roles</h2>
    <button @click="$emit('create-role')" class="btn-primary">
      + Añadir Rol
    </button>
  </div>
</template>

<script setup>
defineEmits(['create-role'])
</script>
