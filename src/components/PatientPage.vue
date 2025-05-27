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
}

.patient-container {
  max-width: 1200px;
  margin: 0 auto;
}

.patient-content {
  display: flex;
  margin-top: 20px;
  gap: 20px;
}

.side-panel {
  flex: 0 0 250px;
}

.main-content {
  flex: 1;
}
</style>