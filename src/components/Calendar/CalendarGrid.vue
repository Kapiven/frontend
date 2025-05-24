<template>
  <transition :name="transitionName" :mode="transitionMode">
    <div 
      :key="`${year}-${month}`" 
      class="calendar-container"
    >
      <CalendarDay
        v-for="(day, index) in days"
        :key="index"
        :day="day"
        :is-current="isCurrentDay(day)"
        :appointments="getAppointmentsForDay(day)"
        @day-clicked="handleDayClick"
        @appointment-clicked="handleAppointmentClick"
      />
    </div>
  </transition>
</template>

<script setup>
import CalendarDay from './CalendarDay.vue'

const props = defineProps({
  year: Number,
  month: Number,
  days: Array,
  getAppointmentsForDay: Function,
  isCurrentDay: Function,
  transitionName: {
    type: String,
    default: 'calendar-fade'
  },
  transitionMode: {
    type: String,
    default: 'out-in'
  }
})

const emit = defineEmits(['day-clicked', 'appointment-clicked'])

const handleDayClick = (day) => {
  emit('day-clicked', day)
}

const handleAppointmentClick = (appointment) => {
  emit('appointment-clicked', appointment)
}
</script>