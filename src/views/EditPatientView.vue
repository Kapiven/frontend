<template>
  <div class="edit-patient-wrapper">
    <AppNavigation />
    
    <div class="edit-patient-page">
      <div class="edit-patient-container">
        <!-- Gradient header (Nueva Consulta style) -->
        <div class="page-header">
          <div class="header-content">
            <h1>Editar Paciente</h1>
            <div class="header-meta">
              <span class="version-tag">ID {{ patientId }}</span>
              <span class="edit-badge">{{ patientData?.name || 'Cargando…' }}</span>
            </div>
          </div>
          <button @click="goBack" class="back-btn" aria-label="Volver">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span class="back-text">Volver</span>
          </button>
        </div>

        <div v-if="isLoading" class="loading-message">Cargando datos del paciente...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        
        <form v-else-if="patientData" @submit.prevent="handleSave" class="edit-patient-form">
          <div class="form-grid">
            <!-- Información de Contacto -->
            <div class="section-header">
              <h3>Información de Contacto</h3>
            </div>
            
            <div class="form-group full-width">
              <label for="phone">Teléfono</label>
              <input
                id="phone"
                v-model="editForm.telefono"
                type="tel"
                class="form-input"
                placeholder="Número de teléfono"
              />
            </div>

            <!-- Antecedentes -->
            <div class="section-header">
              <h3>Antecedentes</h3>
            </div>

            <div class="form-group full-width">
              <label for="medicalHistory">Antecedentes Médicos</label>
              <textarea
                id="medicalHistory"
                v-model="editForm.medicos"
                class="form-input"
                rows="4"
                placeholder="Antecedentes médicos del paciente"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label for="ocularHistory">Antecedentes Oculares</label>
              <textarea
                id="ocularHistory"
                v-model="editForm.oculares"
                class="form-input"
                rows="4"
                placeholder="Antecedentes oculares del paciente"
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label for="allergicHistory">Antecedentes Alérgicos</label>
              <textarea
                id="allergicHistory"
                v-model="editForm.alergicos"
                class="form-input"
                rows="3"
                placeholder="Alergias conocidas del paciente"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              <span v-if="isSaving">Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AppNavigation from '@/components/AppNavigation.vue'
import { getPatientDetails, updatePatient } from '@/services/patientService'

export default {
  name: 'EditPatientView',
  components: {
    AppNavigation,
  },
  props: {
    patientId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      patientData: null,
      editForm: {
        telefono: '',
        medicos: '',
        oculares: '',
        alergicos: '',
      },
      isLoading: true,
      isSaving: false,
      error: null,
    }
  },
  async mounted() {
    try {
      const details = await getPatientDetails(this.patientId)
      this.patientData = details
      // Prefill form fields from fetched details
      this.editForm.telefono = details.phone || ''
      this.editForm.medicos = details.medicalHistory || ''
      this.editForm.oculares = details.ocularHistory || ''
      this.editForm.alergicos = details.allergies || ''
    } catch (e) {
      console.error('Error fetching patient:', e)
      this.error = 'No se pudo cargar la información del paciente'
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    async handleSave() {
      this.isSaving = true
      try {
        await updatePatient(this.patientId, this.editForm)
        alert('Datos del paciente actualizados correctamente')
        this.$router.push(`/patient/${this.patientId}`)
      } catch (error) {
        console.error('Error updating patient:', error)
        alert('Error al actualizar los datos del paciente')
      } finally {
        this.isSaving = false
      }
    },
    goBack() {
      this.$router.push(`/patient/${this.patientId}`)
    },
  },
}
</script>

<style scoped>
.edit-patient-wrapper {
  min-height: 100vh;
  background: var(--color-background);
}

.edit-patient-page {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background: var(--color-background-soft);
  color: var(--color-text);
  min-height: 100vh;
}

.edit-patient-container {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--color-card-bg);
  box-shadow: var(--shadow-large);
  border-radius: 1.5rem;
  padding: 2.5rem;
}

/* Gradient page header (consistent with Nueva Consulta) */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: var(--gradient-primary);
  color: var(--color-on-primary);
}

.header-content h1 {
  margin: 0;
  color: var(--color-on-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.header-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.version-tag, .edit-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255,255,255,0.35);
  background: transparent;
  color: var(--color-on-primary);
  font-size: 0.75rem;
}

.edit-badge { background: rgba(255,255,255,0.12); }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--color-on-primary);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 0.625rem;
  padding: 0.5rem 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.back-btn:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
.back-btn .back-text { display: inline; }

.edit-patient-form {
  max-width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  grid-column: 1 / -1;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.section-header:first-child {
  margin-top: 0;
}

.section-header h3 {
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-heading);
  font-size: 1.2rem;
  font-weight: 600;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-input-bg);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-input-border-focus);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

select.form-input {
  cursor: pointer;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
}

.cancel-btn {
  background: var(--color-btn-secondary);
  color: var(--color-btn-secondary-text);
  border: 1px solid var(--color-border);
}

.cancel-btn:hover {
  background: var(--color-btn-secondary-hover);
}

.save-btn {
  background: var(--color-btn-primary);
  color: var(--color-btn-primary-text);
}

.save-btn:hover {
  background: var(--color-btn-primary-hover);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-message,
.error-message {
  text-align: center;
  margin: 2rem 0;
  font-size: 1.2em;
}

.error-message {
  color: var(--color-danger);
}

/* Dark mode adjustments */
.dark .edit-patient-container {
  background: #181818;
  box-shadow: 0 0 0 2px #23272a, 0 8px 32px rgba(0,0,0,0.40), 0 1.5px 8px rgba(0,0,0,0.22);
}

/* Back button adapts over gradient automatically via on-primary */

.dark .save-btn {
  background: var(--color-btn-primary) !important;
  color: var(--color-btn-primary-text) !important;
}

.dark .save-btn:hover {
  background: var(--color-btn-primary-hover) !important;
}

.dark .cancel-btn {
  background: var(--color-btn-secondary) !important;
  color: var(--color-btn-secondary-text) !important;
  border-color: var(--color-border) !important;
}

.dark .cancel-btn:hover {
  background: var(--color-btn-secondary-hover) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .edit-patient-container {
    padding: 1.5rem;
  }

  .header-content h1 { font-size: 1.25rem; }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-btn, .save-btn {
    width: 100%;
  }
}
</style>
