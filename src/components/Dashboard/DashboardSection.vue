<template>
    <TodayAppointments
        :title="props.titles[0]"
        :todayIntervals="props.todayIntervals"
        :formatTime="props.formatTime"
        @patientRedirect="handlePatientRedirect"
        @click="printTitles"
    />
    <PendingExams
        :title="props.titles[1]"
        :recentExams="props.recentExams"
        @examRedirect="handleExamRedirect"
    />
</template>

<script setup>
import TodayAppointments from './TodayAppointments.vue';
import PendingExams from './PendingExams.vue';

const emit = defineEmits(['patientRedirect', 'examRedirect']);

const props = defineProps({
    todayIntervals: {
        type: Array,
        required: true
    },
    formatTime: {
        type: Function,
        required: true
    },
    titles: {
        type: Array,
        required: true
    },
    recentExams: {
        type: Array,
        default: () => []
    },
})

function handlePatientRedirect(patientId) {
    emit('patientRedirect', patientId);
}

function handleExamRedirect(examId) {
    emit('examRedirect', examId);
}
</script>