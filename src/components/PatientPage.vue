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
          <!-- Side panel con botón de editar -->
          <div class="side-panel-container">
            <patient-side-panel :patient="patientData" class="side-panel" />
            <button @click="handleEditPatient" class="edit-patient-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4Z"></path>
              </svg>
              Editar
            </button>
          </div>

          <div class="main-content">
            <!-- Consultations -->
            <ConsultationsSection
              :consultations="consultations"
              @add-consultation="openNewModal"
              @view-consultation="openShowModal"
            />

            <ShowConsultationModal
              v-if="selectedConsultation"
              :consultation="selectedConsultation"
              @close="selectedConsultation = null"
            />

            <!-- Exams -->
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

      <!-- New Consultation Modal -->
      <NewConsultationModal
        v-if="showNewConsultationModal"
        :patient-name="patientData?.name"
        :patient-id="patientId"
        @close="closeNewConsultationModal"
      />

      <!-- New Exam Modal -->
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
import ShowConsultationModal from './PatientPage/ShowConsultationModal.vue' // ✅ new import
import ExamsSection from './PatientPage/ExamsSection.vue'
import NewConsultationModal from './PatientPage/NewConsultationModal.vue'
import NewExamModal from './PatientPage/NewExamModal.vue'
import { getPatientDetails } from '@/services/patientService'
import { getExamsByPatientId } from '@/services/examService'

export default {
  name: 'PatientPage',
  components: {
    AppNavigation,
    PatientHeader,
    PatientSidePanel,
    ConsultationsSection,
    ShowConsultationModal, // ✅ register it
    ExamsSection,
    NewConsultationModal,
    NewExamModal,
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
      consultations: [], // ✅ added
      examData: null,
      isLoading: true,
      error: null,
      showNewConsultationModal: false,
      selectedConsultation: null, // ✅ added
      showUploadModal: false,
      selectedExamForUpload: null,
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
      this.consultations = []

      try {
        const [patientDetails, exams] = await Promise.all([
          getPatientDetails(id),
          getExamsByPatientId(id),
        ])

        this.patientData = patientDetails
        this.examData = exams
        this.consultations = patientDetails.consultations || [] // ✅ link consultations
      } catch (error) {
        this.error = 'Error loading patient data.'
        console.error('Error fetching patient data:', error)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Opens new consultation modal
    openNewModal() {
      this.showNewConsultationModal = true
    },

    closeNewConsultationModal() {
      this.showNewConsultationModal = false
    },

    // ✅ Opens details modal
    async openShowModal(consultation) {
      try {
        console.log('📋 Opening details for consultation:', consultation)
        const res = await fetch(
          `http://localhost:4000/api/consultations/${consultation.id}/details`,
        )
        const fullConsultation = await res.json()
        this.selectedConsultation = fullConsultation
      } catch (err) {
        console.error('Error loading consultation details:', err)
      }
    },

    handleAddExam() {
      console.log('Nuevo examen añadido para paciente:', this.patientId)
      this.fetchExamData()
    },

    async fetchExamData() {
      try {
        this.examData = await getExamsByPatientId(this.patientId)
      } catch (error) {
        console.error('Error fetching exam data:', error)
      }
    },

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

    handleEditPatient() {
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
