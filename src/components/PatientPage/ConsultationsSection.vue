<template>
  <div class="consultations-section">
    <div class="section-header">
      <h2>Consultas</h2>
      <button @click="$emit('add-consultation')" class="add-button">+ Nueva Consulta</button>
    </div>

    <div class="consultations-list">
      <div
        v-for="consultation in consultations"
        :key="consultation.id"
        class="consultation-item"
        @click="selectConsultation(consultation)"
      >
        <div class="consultation-reason">{{ consultation.reason }}</div>
        <div class="consultation-meta">
          <span class="consultation-date">{{ formattedDate(consultation.date) }}</span>
          <span class="reminder-icon" title="Set reminder">
            <!-- Bell icon SVG -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 24c1.104 0 2-.897 2-2h-4c0 1.103.896 2 2 2zm6.364-6v-5c0-3.074-1.639-5.642-4.364-6.32V5c0-.828-.671-1.5-1.5-1.5S11 4.172 11 5v1.68C8.275 7.358 6.636 9.926 6.636 13v5l-1.636 1.636V21h16v-1.364L18.364 18z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsultationsSection',
  props: {
    consultations: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },

    selectConsultation(consultation) {
      this.$emit('view-consultation', consultation)
    },
  },
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');

.consultation-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* fecha + campana alineadas a la derecha */
  gap: 8px;
}

.reminder-icon {
  cursor: pointer;
  color: #555;
  transition: color 0.2s;
}

.reminder-icon:hover {
  color: #007bff; /* hover azul para indicar clic */
}
</style>
