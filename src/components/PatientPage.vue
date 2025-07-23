<template>
  <div class="patient-page">
    <button class="dashboard-btn" @click="goToDashboard">Volver al Dashboard</button>
    <div v-if="isLoading" class="loading-message">Cargando datos del paciente...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="patientData" class="patient-container">
      <!-- Header con información básica -->
      <patient-header :patient="patientData" />

      <div class="patient-content">
        <!-- PatientSidePanel needs the date_of_birth to format it -->
        <patient-side-panel :patient="patientData" class="side-panel" />

        <div class="main-content">
          <!-- Pass the fetched data (patientData.consultations) -->
          <consultations-section
            :consultations="patientData.consultations"
            @add-consultation="handleAddConsultation"
          />

          <!-- Pass the fetched data (patientData.exams) -->
            <exams-section 
              :exams="patientData.exams" 
              :patient-id="patientId"
              :consultations="patientData.consultations"
              @add-exam="handleAddExam" 
            />
      
        </div>
      </div>
    </div>
    <div v-else>No se encontraron datos para este paciente.</div>

    <NewConsultationModal v-if="showNewConsultationModal" @close="closeNewConsultationModal" />
  </div>
</template>

<script>
import PatientHeader from './PatientPage/PatientHeader.vue'
import PatientSidePanel from './PatientPage/PatientSidePanel.vue'
import ConsultationsSection from './PatientPage/ConsultationsSection.vue'
import ExamsSection from './PatientPage/ExamsSection.vue'
import NewConsultationModal from './PatientPage/NewConsultationModal.vue'
import { getPatientDetails } from '@/services/patientService'
import { useRouter } from 'vue-router'

export default {
  name: 'PatientPage',
  components: {
    PatientHeader,
    PatientSidePanel,
    ConsultationsSection,
    ExamsSection,
    NewConsultationModal,
  },
  props: {
    patientId: {
      type: [String, Number],
      required: true,
      default: 3,
    },
  },
  data() {
    return {
      patientData: null,
      isLoading: true,
      error: null,
      showNewConsultationModal: false,
    }
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newId) {
        this.fetchPatientData(newId)
      },
    },
  },
  methods: {
    async fetchPatientData(id) {
      this.isLoading = true
      this.error = null
      this.patientData = null

      try {
        const data = await getPatientDetails(id)
        this.patientData = data
      } catch (error) {
        this.error = 'Error loading patient data.'
        console.error('Error fetching patient data:', error)
      } finally {
        this.isLoading = false
      }
    },
    handleAddConsultation() {
      this.showNewConsultationModal = true
    },
    handleAddExam() {
      console.log('Nuevo examen añadido para paciente:', this.patientId)
    },
    closeNewConsultationModal() {
      this.showNewConsultationModal = false
    },
    goToDashboard() {
      this.$router.push('/dashboard')
    },
  },
}
</script>

<style scoped>
@import url('@/assets/styles/patientpage.css');

.loading-message,
.error-message {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2em;
}
.error-message {
  color: red;
}
</style>
