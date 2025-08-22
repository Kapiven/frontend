<template>
  <div
    class="calendar-day"
    :class="{
      'empty-day': !day,
      'current-day': isCurrent,
    }"
    @click="handleDayClick"
  >
    <div v-if="day" class="day-number">
      {{ day }}
      <button 
        class="expand-btn" 
        @click.stop="$emit('day-clicked', day)"
        aria-label="Agregar cita"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2v12M2 8h12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
    <ul v-if="day" class="appointments">
      <li
        v-for="appt in appointments"
        :key="appt.id"
        @click.stop="$emit('appointment-clicked', appt)"
        class="appointment-item"
      >
        <span>{{ formatStartTime(appt.start) }} - {{ appt.name }}</span>
      </li>
      <li v-if="appointments.length === 0" class="no-appointments">
        No hay citas
      </li>
    </ul>
  </div>
</template>

<script setup>

const props = defineProps({
  day: Number,
  isCurrent: Boolean,
  appointments: Array
})

const emit = defineEmits(['day-clicked', 'appointment-clicked'])

const formatStartTime = (startStr) => {
  const start = new Date(startStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(start.getHours())}:${pad(start.getMinutes())}`
}

// Función para manejar el clic en el día
const handleDayClick = () => {
  // Solo emitir el evento si hay un día válido
  if (props.day) {
    emit('day-clicked', props.day)
  }
}
</script>