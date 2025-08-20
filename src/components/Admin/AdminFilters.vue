<template>
  <div class="admin-filters">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      type="text"
      placeholder="Buscar por nombre o rol..."
      class="filter-input"
    />
    <select
      :value="role"
      @change="$emit('update:role', $event.target.value)"
      class="filter-select"
    >
      <option value="">Todos los roles</option>
      <option v-for="roleOption in roleOptions" :key="roleOption" :value="roleOption">
        {{ roleOption }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  search: String,
  role: String,
  roleOptions: Array
})

defineEmits(['update:search', 'update:role'])
</script>
