<template>
  <div class="section">
    <h2>{{ title }}</h2>
    <ul>
      <li
        v-for="exam in recentExams"
        :key="exam.id"
        @click="emit('openExamUploadModal', exam)"
        class="exam-list-item"
      >
        {{ exam.date }} - {{ exam.patient }} ({{ exam.type }})
      </li>
    </ul>
    <p v-if="recentExams.length === 0">No hay exámenes pendientes.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Exámenes Pendientes',
  },
  recentExams: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['openExamUploadModal'])
</script>
