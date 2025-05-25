<template>
    <div class="section">
        <h2>{{ title }}</h2>
        <ul>
            <template v-for="(item, idx) in props.todayIntervals" :key="idx">
            <li v-if="item.type === 'free'" class="interval-row free-interval">
                <span class="interval-time">
                {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
                </span>
                <span class="interval-label">Libre</span>
            </li>
            <li v-else class="interval-row appointment-item" @click="emit('patientRedirect', item.appt.id)">
                <span class="interval-time">
                {{ formatTime(item.appt.start) }} - {{ formatTime(getApptEnd(item.appt)) }}
                </span>
                <span class="interval-label">{{ item.appt.name }}</span>
            </li>
            </template>
            <li v-if="props.todayIntervals.length === 0" class="no-appointments">
            No hay citas ni intervalos libres de 20+ minutos hoy
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: 'Citas de hoy'
    },
    todayIntervals: {
        type: Array,
        required: true,
        default: () => []
    },
    formatTime: {
        type: Function,
        required: true
    }
})

const emit = defineEmits(['patientRedirect'])
</script>