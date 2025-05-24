<template>
    <!-- Headers for the days of the week -->
    <div class="weekday-row">
    <div class="weekday-header" v-for="day in weekDays" :key="day">
        {{ day }}
    </div>
    </div>
</template>

<script setup>
// Days of the week headers
const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

</script>