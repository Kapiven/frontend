<template>
  <div class="flex flex-col md:flex-row gap-4 mb-6">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      type="text"
      placeholder="Buscar por nombre o rol..."
      class="input-filter w-full md:w-1/2"
    />
    <select
      :value="role"
      @change="$emit('update:role', $event.target.value)"
      class="select-filter w-full md:w-1/3"
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
