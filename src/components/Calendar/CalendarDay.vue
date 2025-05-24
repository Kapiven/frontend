<template>
  <div
    class="calendar-day"
    :class="{
      'empty-day': !day,
      'current-day': isCurrent,
    }"
  >
    <div v-if="day" class="day-number">
      {{ day }}
      <button 
        class="expand-btn" 
        @click="$emit('day-clicked', day)"
        aria-label="Detalles"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polyline
            points="3,8 3,3 8,3"
            stroke="#1976d2"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            />
            <polyline
            points="12,3 17,3 17,8"
            stroke="#1976d2"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            />
            <polyline
            points="17,12 17,17 12,17"
            stroke="#1976d2"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            />
            <polyline
            points="8,17 3,17 3,12"
            stroke="#1976d2"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            />
        </svg>
      </button>
    </div>
    <ul v-if="day" class="appointments">
      <li
        v-for="appt in appointments"
        :key="appt.id"
        @click="$emit('appointment-clicked', appt)"
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
import { defineProps, defineEmits } from 'vue'

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

async function openDayModal(day) {
  expandedDay.value = day
  showDayModal.value = true
  if (!day) return
  try {
    dayModalBusinessHours.value = await getBusinessHoursForDay(dayModalDateStr.value)
  } catch (e) {
    dayModalBusinessHours.value = []
  }
  try {
    dayModalAppointments.value = await getAppointmentsForDate(dayModalDateStr.value)
  } catch (e) {
    dayModalAppointments.value = []
  }
}
</script>