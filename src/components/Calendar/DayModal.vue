<template>
  <div v-if="show" class="modal-overlay" @click.self="handleBackgroundClick">
    <div class="modal expanded-day-modal">
      <div class="modal-header">
        <h3>{{ expandedDay }} de {{ monthNames[displayMonth] }} {{ displayYear }}</h3>
        <button class="close-button" @click="emit('close')">×</button>
      </div>
      <div class="modal-content">
        <div class="day-summary-header" style="margin-bottom: 1rem">
          <span class="day-summary-title">
            Horario laboral:
            <span v-if="dayModalBusinessHours.length">
              <span v-for="(interval, idx) in dayModalBusinessHours" :key="idx">
                {{ interval.start }} - {{ interval.end }}
                <span v-if="idx < dayModalBusinessHours.length - 1">,&nbsp;</span>
              </span>
            </span>
            <span v-else>Dia Libre</span>
          </span>
        </div>

        <ul>
          <template v-for="(item, idx) in dayModalIntervals" :key="idx">
            <li
              v-if="item.type === 'free'"
              class="interval-row free-interval"
              @click="handleNewAppointment(expandedDay, item.start)"
              style="cursor: pointer"
            >
              <span class="interval-time">
                {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
              </span>
              <span class="interval-label">Libre (Click para agendar)</span>
            </li>
            <li
              v-else
              class="interval-row"
              @click="handleApptClick(item.appt)"
            >
              <span class="interval-time">
                {{ formatTime(item.appt.start) }} - {{ formatTime(getApptEnd(item.appt)) }}
              </span>
              <span class="interval-label">{{ item.appt.name }}</span>
            </li>
          </template>

          <li v-if="dayModalIntervals.length === 0" class="no-appointments">
            No hay citas ni intervalos libres de 20+ minutos
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup>
import { nextTick } from 'vue'

defineProps({
  show: Boolean,
  expandedDay: Number,
  displayMonth: Number,
  displayYear: Number,
  monthNames: {
    type: Array,
    default: () => []
  },
  dayModalBusinessHours: {
    type: Array,
    default: () => []
  },
  dayModalIntervals: {
    type: Array,
    default: () => []
  },
  formatTime: Function,
  getApptEnd: Function
})

const emit = defineEmits([
  'close',
  'open-new-appt',
  'open-appt-details'
])

function handleBackgroundClick() {
  emit('close')
}

async function handleNewAppointment(day, start) {
  emit('open-new-appt', { day, start })
}

async function handleApptClick(appt) {
  emit('close')
  await nextTick()
  emit('open-appt-details', appt)
}
</script>