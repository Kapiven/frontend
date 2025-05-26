<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal appointment-details-modal">
      <div v-if="detailsLoading" class="details-loading">
        <p>Cargando detalles...</p>
      </div>

      <div v-else-if="detailsError" class="error-container">
        <p class="error">Error al cargar detalles: {{ detailsError.message }}</p>
      </div>

      <div v-else-if="selectedAppointment && props.selectedPatient " class="appointment-details">
        <div class="modal-header">
          <h3>Detalles de Cita</h3>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>

        <!-- Main Info -->
        <div class="details-main-info">
          <h2 class="patient-name">{{ props.selectedPatient .name }}</h2>
          <div class="appointment-time-info">
            <p class="appointment-date">{{ formatFullDate(selectedAppointment.start) }}</p>
            <p class="appointment-time">{{ formatTimeRange(selectedAppointment.start, selectedAppointment.duration) }}</p>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="details-section">
          <h4 class="section-title">Información de Contacto</h4>
          <div class="section-content">
            <p v-if="props.selectedPatient .phone"><strong>Teléfono:</strong> {{ props.selectedPatient .phone }}</p>
            <p v-if="props.selectedPatient .email"><strong>Email:</strong> {{ props.selectedPatient .email }}</p>
            <p v-if="!props.selectedPatient .phone && !props.selectedPatient .email" class="no-data">No hay información de contacto disponible</p>
          </div>
        </div>

        <!-- Antecedentes -->
        <div v-if="props.selectedPatient .antecedentes" class="details-section antecedentes-section">
          <h4 class="section-title">Antecedentes</h4>
          <div class="section-content">
            <div v-if="hasAntecedentes" class="antecedentes-grid">
              <div v-if="props.selectedPatient .antecedentes.medical"><h5>Médicos</h5><p>{{ props.selectedPatient .antecedentes.medical }}</p></div>
              <div v-if="props.selectedPatient .antecedentes.family"><h5>Familiares</h5><p>{{ props.selectedPatient .antecedentes.family }}</p></div>
              <div v-if="props.selectedPatient .antecedentes.ocular"><h5>Oculares</h5><p>{{ props.selectedPatient .antecedentes.ocular }}</p></div>
              <div v-if="props.selectedPatient .antecedentes.allergic"><h5>Alérgicos</h5><p>{{ props.selectedPatient .antecedentes.allergic }}</p></div>
              <div v-if="props.selectedPatient .antecedentes.other"><h5>Otros</h5><p>{{ props.selectedPatient .antecedentes.other }}</p></div>
            </div>
            <p v-else class="no-data">No hay antecedentes registrados</p>
          </div>
        </div>

        <!-- Notas -->
        <div v-if="selectedAppointment.notes" class="details-section">
          <h4 class="section-title">Notas de la Cita</h4>
          <div class="section-content">
            <p class="appointment-notes">{{ selectedAppointment.notes }}</p>
          </div>
        </div>

        <!-- Botones -->
        <div class="modal-actions appointment-actions">
          <button class="action-button edit-button" @click="$emit('edit', selectedAppointment)">Editar Cita</button>
          <button class="action-button delete-button" @click="$emit('delete', selectedAppointment)">Cancelar Cita</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  detailsLoading: Boolean,
  detailsError: Object,
  selectedAppointment: Object,
  selectedPatient : Object,
  formatFullDate: Function,
  formatTimeRange: Function
})

const hasAntecedentes = computed(() => {
  const antecedentes = props.selectedPatient ?.antecedentes || {}
  return antecedentes.medical || antecedentes.family || antecedentes.ocular || antecedentes.allergic || antecedentes.other
})
</script>
