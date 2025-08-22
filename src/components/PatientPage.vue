<template>
  <div class="patient-wrapper">
    <AppNavigation />
    
    <div class="patient-page">
      <div v-if="isLoading" class="loading-message">Cargando datos del paciente...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="patientData" class="patient-container">
        <!-- Header con información básica -->
        <patient-header :patient="patientData" />

        <div class="patient-content">
          <!-- PatientSidePanel needs the date_of_birth to format it -->
          <div class="side-panel-container">
            <patient-side-panel :patient="patientData" class="side-panel" />
            <button @click="handleEditPatient" class="edit-patient-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4Z"></path>
              </svg>
              Editar
            </button>
          </div>

          <div class="main-content">
            <!-- Pass the fetched data (patientData.consultations) -->
            <consultations-section
              :consultations="patientData.consultations"
              @add-consultation="handleAddConsultation"
            />

            <!-- Add the missing event handler -->
            <exams-section
              :exams="examData || []"
              :patient-id="patientId"
              :consultations="patientData.consultations"
              @add-exam="handleAddExam"
              @openExamUploadModal="handleOpenExamUploadModal"
            />
          </div>
        </div>
      </div>
      <div v-else>No se encontraron datos para este paciente.</div>

      <NewConsultationModal v-if="showNewConsultationModal" @close="closeNewConsultationModal" />

      <!-- Add the upload modal -->
      <NewExamModal
        v-if="showUploadModal"
        :selected-exam="selectedExamForUpload"
        @close="closeUploadModal"
        @examUpdated="handleExamFileUploaded"
      />
    </div>
  </div>
</template>

<script>
import AppNavigation from '@/components/AppNavigation.vue'
import PatientHeader from './PatientPage/PatientHeader.vue'
import PatientSidePanel from './PatientPage/PatientSidePanel.vue'
import ConsultationsSection from './PatientPage/ConsultationsSection.vue'
import ExamsSection from './PatientPage/ExamsSection.vue'
import NewConsultationModal from './PatientPage/NewConsultationModal.vue'
import NewExamModal from './PatientPage/NewExamModal.vue' // Add this import
import { getPatientDetails } from '@/services/patientService'
import { getExamsByPatientId } from '@/services/examService'
import { useRouter } from 'vue-router'

export default {
  name: 'PatientPage',
  components: {
    AppNavigation,
    PatientHeader,
    PatientSidePanel,
    ConsultationsSection,
    ExamsSection,
    NewConsultationModal,
    NewExamModal, // Add this component
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
      examData: null,
      isLoading: true,
      error: null,
      showNewConsultationModal: false,
      showUploadModal: false, // Add this
      selectedExamForUpload: null, // Add this
    }
  },
  watch: {
    patientId: {
      immediate: true,
      handler(newId) {
        console.log('🔍 PatientPage: patientId changed to:', newId)
        this.fetchPatientData(newId)
      },
    },
  },
  methods: {
    async fetchPatientData(id) {
      console.log('🔍 PatientPage: Fetching data for patient ID:', id)
      this.isLoading = true
      this.error = null
      this.patientData = null
      this.examData = null

      try {
        const [patientDetails, exams] = await Promise.all([
          getPatientDetails(id),
          getExamsByPatientId(id),
        ])

        this.patientData = patientDetails
        this.examData = exams
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
      this.fetchExamData()
    },

    // Add these new methods
    handleOpenExamUploadModal(exam) {
      this.selectedExamForUpload = exam
      this.showUploadModal = true
    },

    closeUploadModal() {
      this.showUploadModal = false
      this.selectedExamForUpload = null
    },

    async handleExamFileUploaded(examId) {
      console.log(`Exam ID ${examId} file uploaded successfully. Re-fetching exams.`)
      await this.fetchExamData()
      this.closeUploadModal()
    },

    async fetchExamData() {
      try {
        this.examData = await getExamsByPatientId(this.patientId)
      } catch (error) {
        console.error('Error fetching exam data:', error)
      }
    },

    closeNewConsultationModal() {
      this.showNewConsultationModal = false
    },

    handleEditPatient() {
      // Navigate to edit patient page
      this.$router.push(`/patients/${this.patientId}/edit`)
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
