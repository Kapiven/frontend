<template>
    <div class="section">
        <h2>{{ title }}</h2>
        <ul>
            <li v-for="exam in recentExams" :key="exam.id" @click="emit('examRedirect', exam.id)">
            {{ exam.date }} - {{ exam.patient }} ({{ exam.type }})
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: 'Exámenes Pendientes'
    },
    recentExams: {
        type: Array,
        required: true
    },
})

const emit = defineEmits(['examRedirect'])
</script>