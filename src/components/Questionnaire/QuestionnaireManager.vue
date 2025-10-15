<template>
  <div class="questionnaire-manager">
    <div class="header">
      <h1>Gestión de Cuestionarios</h1>
      <div class="filters">
        <button @click="toggleShowAll" :class="{ active: showAll }" class="btn btn-outline">
          {{ showAll ? 'Mostrar Solo Activos' : 'Mostrar Todos' }}
        </button>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <QuestionnaireList
        :key="showAll"
        :questionnaires="questionnaires"
        :loading="loading"
        @edit="openEditModal"
        @toggle-active="toggleActive"
        @view-details="viewDetails"
      />
    </transition>

    <QuestionnaireEditModal
      v-if="showEditModal"
      :questionnaire="selectedQuestionnaire"
      @close="closeEditModal"
      @save="handleSave"
    />

    <QuestionnaireDetails
      v-if="showDetailsModal"
      :questionnaire="selectedQuestionnaireDetails"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script>
import { questionnaireService } from '@/services/questionnaireService'
import QuestionnaireList from './QuestionnaireList.vue'
import QuestionnaireEditModal from './QuestionnaireEditModal.vue'
import QuestionnaireDetails from './QuestionnaireDetails.vue'

export default {
  components: {
    QuestionnaireList,
    QuestionnaireEditModal,
    QuestionnaireDetails,
  },
  data() {
    return {
      questionnaires: [],
      loading: false,
      showAll: false,
      showEditModal: false,
      showDetailsModal: false,
      selectedQuestionnaire: null,
      selectedQuestionnaireDetails: null,
    }
  },
  async mounted() {
    await this.loadQuestionnaires()
  },
  methods: {
    async loadQuestionnaires() {
      try {
        this.questionnaires = this.showAll
          ? await questionnaireService.getAll()
          : await questionnaireService.getActive()
      } catch (error) {
        console.error('Error cargando cuestionarios:', error)
        this.questionnaires = []
      }
    },

    async toggleShowAll() {
      this.showAll = !this.showAll
      await this.loadQuestionnaires()
    },

    async openEditModal(questionnaire) {
      try {
        // Load the full questionnaire with questions, just like you do for details
        this.selectedQuestionnaire = await questionnaireService.getWithQuestions(questionnaire.id)
        this.showEditModal = true
      } catch (error) {
        console.error('Error loading questionnaire for editing:', error)
        // Fallback to basic questionnaire if loading fails
        this.selectedQuestionnaire = { ...questionnaire }
        this.showEditModal = true
      }
    },
    closeEditModal() {
      this.showEditModal = false
      this.selectedQuestionnaire = null
    },

    async handleSave(updatedQuestionnaire) {
      try {
        await questionnaireService.update(updatedQuestionnaire.id, {
          name: updatedQuestionnaire.name,
          version: updatedQuestionnaire.version,
        })
        await this.loadQuestionnaires()
        this.closeEditModal()
      } catch (error) {
        console.error('Error actualizando cuestionario:', error)
      }
    },

    async toggleActive(questionnaire) {
      try {
        await questionnaireService.setActive(questionnaire.id, !questionnaire.active)
        await this.loadQuestionnaires()
      } catch (error) {
        console.error('Error cambiando estado activo:', error)
      }
    },

    async viewDetails(questionnaire) {
      try {
        this.selectedQuestionnaireDetails = await questionnaireService.getWithQuestions(
          questionnaire.id,
        )
        this.showDetailsModal = true
      } catch (error) {
        console.error('Error cargando detalles del cuestionario:', error)
      }
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedQuestionnaireDetails = null
    },
  },
}
</script>

<style scoped>
.questionnaire-manager {
  width: 100%;
  min-height: 70vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-border);
}

.header h1 {
  color: var(--color-heading);
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.filters {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: 0.01em;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Use global .btn-outline; emphasize active state */
.btn-outline.active { box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
