<template>
  <div class="calendar-header">
    <h2>Calendario de Citas</h2>
    <div class="header-actions">
      <div class="date-navigator">
        <button class="nav-arrow" @click="changeMonth(-1)">
          <span class="arrow-icon">&#8249;</span>
        </button>
        <div class="date-selector" @click="toggleDatePicker">
          <span>{{ monthNames[displayMonth] }} {{ displayYear }}</span>
          <span class="dropdown-icon">&#9662;</span>

          <div v-if="showDatePicker" class="date-picker-dropdown" @click.stop>
            <div class="picker-header">
              <button @click.stop="tempYear--">&#8249;</button>
              <span>{{ tempYear }}</span>
              <button @click.stop="tempYear++">&#8250;</button>
            </div>
            <div class="month-grid">
              <div
                v-for="(month, idx) in monthNames"
                :key="month"
                :class="[
                  'month-item',
                  displayMonth === idx && tempYear === displayYear ? 'selected' : '',
                ]"
                @click.stop="selectMonth(idx)"
              >
                {{ month.substring(0, 3) }}
              </div>
            </div>
          </div>
        </div>
        <button class="nav-arrow" @click="changeMonth(1)">
          <span class="arrow-icon">&#8250;</span>
        </button>
      </div>
      <button @click="emit('dashboard-redirect')">Dashboard</button>
    </div>
  </div>
</template>

<script setup>
import { defineModel, defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  displayMonth: Number,
  displayYear: Number,
  monthNames: {
    type: Array,
    default: () => [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
  }
})

const showDatePicker = defineModel('showDatePicker')  // ← clave

const emit = defineEmits(['update:month', 'update:year', 'dashboard-redirect'])

const tempYear = ref(props.displayYear)

watch(() => props.displayYear, (newYear) => {
  tempYear.value = newYear
})

function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value
}

function selectMonth(index) {
  emit('update:month', index)
  emit('update:year', tempYear.value)
  showDatePicker.value = false
}

function changeMonth(direction) {
  let newMonth = props.displayMonth + direction
  let newYear = props.displayYear

  if (newMonth < 0) {
    newMonth = 11
    newYear--
  } else if (newMonth > 11) {
    newMonth = 0
    newYear++
  }

  emit('update:month', newMonth)
  emit('update:year', newYear)
}
</script>