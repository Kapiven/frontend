<template>
  <div class="patient-list">
    <h2>Pacientes</h2>

    <input
      type="text"
      v-model="search"
      placeholder="Buscar paciente..."
      class="patient-search"
    />

    <ul>
      <li
        v-for="paciente in filteredPacientes"
        :key="paciente.id"
        @click="$emit('select', paciente)"
        :class="[
          'patient-item',
          selected?.id === paciente.id ? 'active' : ''
        ]"
      >
        <p class="name">{{ paciente.nombre }}</p>
        <p class="phone">{{ paciente.telefono }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  pacientes: Array,
  selected: Object
})

const search = ref('')

const filteredPacientes = computed(() =>
  props.pacientes.filter(p =>
    p.nombre.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>
