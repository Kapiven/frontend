<template>
  <div class="calendar-header">
    <h2>Calendario de Citas</h2>
    <div class="header-actions">
      <div class="date-navigator">
        <button class="nav-arrow" @click="changeMonth(-1)">
          <span class="arrow-icon">&#8249;</span>
        </button>
        <div class="date-selector" @click="toggleDatePicker" ref="dateSelectorRef">
          <span>{{ monthNames[displayMonth] }} {{ displayYear }}</span>
          <span class="dropdown-icon">&#9662;</span>

          <div v-if="showDatePicker" class="date-picker-dropdown" ref="dropdownRef" @click.stop>
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

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

const emit = defineEmits(['update:month', 'update:year'])

const tempYear = ref(props.displayYear)
const dateSelectorRef = ref(null)
const dropdownRef = ref(null)

watch(() => props.displayYear, (newYear) => {
  tempYear.value = newYear
})

// Watch for when the dropdown opens to adjust its position
watch(showDatePicker, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    adjustDropdownPosition()
  }
})

function adjustDropdownPosition() {
  if (!dateSelectorRef.value || !dropdownRef.value) return
  
  const selector = dateSelectorRef.value
  const dropdown = dropdownRef.value
  const viewportWidth = window.innerWidth
  
  // Get the position of the selector relative to the viewport
  const selectorRect = selector.getBoundingClientRect()
  const dropdownWidth = 280 // Match the CSS width
  
  // Check if there's enough space on the right
  const spaceOnRight = viewportWidth - selectorRect.right
  const spaceOnLeft = selectorRect.left
  
  // Reset positioning classes
  dropdown.classList.remove('dropdown-left', 'dropdown-right', 'dropdown-center')
  
  if (spaceOnRight >= dropdownWidth) {
    // Enough space on the right, align to left edge of selector
    dropdown.classList.add('dropdown-right')
  } else if (spaceOnLeft >= dropdownWidth) {
    // Not enough space on right, align to right edge of selector
    dropdown.classList.add('dropdown-left')
  } else {
    // Not enough space on either side, center it
    dropdown.classList.add('dropdown-center')
  }
}

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