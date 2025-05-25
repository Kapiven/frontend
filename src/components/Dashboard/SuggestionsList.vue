<template>
  <ul v-if="visible" class="suggestions-list">
    <li
      v-for="patient in suggestions"
      :key="patient.id"
      @click="$emit('select', patient)"
    >
      {{ patient.name }} ({{ patient.id }})
    </li>
    <li
      v-if="!suggestions.length && query.length >= 2"
      class="no-results"
    >
      No se encontraron pacientes
    </li>
  </ul>
</template>

<script setup>
defineProps({
  suggestions: Array,
  visible: Boolean,
  query: String
})

defineEmits(['select'])
</script>
