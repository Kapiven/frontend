<template>
  <div class="patient-page">
    <div class="patient-container">
      <!-- Header con información básica -->
      <patient-header :patient="patientData" />
      
      <div class="patient-content">
        <patient-side-panel :patient="patientData" class="side-panel" />
        
        <div class="main-content">
          <consultations-section 
            :consultations="patientData.consultations"
            @add-consultation="handleAddConsultation"
          />
          
          <exams-section 
            :exams="patientData.exams"
            @add-exam="handleAddExam"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PatientHeader from './PatientPage/PatientHeader.vue'
import PatientSidePanel from './PatientPage/PatientSidePanel.vue'
import ConsultationsSection from './PatientPage/ConsultationsSection.vue'
import ExamsSection from './PatientPage/ExamsSection.vue'

export default {
  name: 'PatientPage',
  components: {
    PatientHeader,
    PatientSidePanel,
    ConsultationsSection,
    ExamsSection
  },
  data() {
    return {
      patientData: {
        id: 1,
        name: 'Juan Pérez',
        birthDate: '1985-03-15',
        gender: 'Masculino',
        phone: '+1234567890',
        allergies: 'Penicilina, Polen',
        ocularHistory: 'Miopía desde 2005',
        medicalHistory: 'Hipertensión controlada',
        familyHistory: 'Abuelo con glaucoma',
        consultations: [
          { id: 1, reason: 'Control anual', date: '2023-05-10' },
          { id: 2, reason: 'Dolor ocular', date: '2023-02-15' }
        ],
        exams: [
          { id: 1, name: 'Topografía corneal', date: '2023-05-10' }
        ]
      }
    }
  },
  methods: {
    handleAddConsultation() {
      // Lógica para añadir nueva consulta
      console.log('Nueva consulta añadida')
    },
    handleAddExam() {
      // Lógica para añadir nuevo examen
      console.log('Nuevo examen añadido')
    }
  }
}
</script>

<style scoped>
.patient-page {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background: #f6f8fa !important;
  color: #111;
  min-height: 100vh;
}

.patient-container {
  max-width: 1800px;
  margin: 0 auto;
  background: #fff !important;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.08), 0 1.5px 8px rgba(0,0,0,0.06);
  border-radius: 1.5rem;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}

.patient-content {
  display: flex;
  margin-top: 32px;
  gap: 40px;
}

.side-panel {
  flex: 0 0 340px;
  background: #fff !important;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.07), 0 1px 4px rgba(0,0,0,0.04);
  padding: 2rem 1.5rem;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-content {
  flex: 1;
  background: #fff !important;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.07), 0 1px 4px rgba(0,0,0,0.04);
  padding: 2rem 2.5rem;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.patient-header {
  margin-bottom: 32px;
  padding-bottom: 18px;
  border-bottom: 1.5px solid #e3e8ee;
  background: transparent;
}

.patient-header h1 {
  margin: 0;
  color: #1976d2;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -1px;
}

.patient-header .patient-info {
  display: flex;
  gap: 32px;
  margin-top: 12px;
  color: #222;
  font-size: 1.1rem;
}

.patient-header, .patient-info, .side-panel, .panel-section, .main-content, .consultations-section, .exams-section, .consultation-item, .exam-item, .panel-section p, .panel-section h3, .consultation-reason, .consultation-date, .exam-name, .exam-date {
  color: #111 !important;
}

:root {
  color-scheme: only light;
}

body, html {
  background: #fff !important;
  color: #111;
}
</style>