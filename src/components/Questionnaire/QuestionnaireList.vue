<template>
  <div class="questionnaire-list">
    <div v-if="loading" class="loading">Cargando cuestionarios...</div>

    <div v-else-if="groupedQuestionnaires.length === 0" class="empty">
      No se encontraron cuestionarios.
    </div>

    <div v-else class="grouped-list">
      <div v-for="group in groupedQuestionnaires" :key="group.name" class="questionnaire-group">
        <h3 class="group-title">{{ group.name }}</h3>
        <div class="versions-grid">
          <QuestionnaireCard
            v-for="questionnaire in group.versions"
            :key="questionnaire.id"
            :questionnaire="questionnaire"
            :compact="true"
            @edit="$emit('edit', questionnaire)"
            @toggle-active="$emit('toggle-active', questionnaire)"
            @view-details="$emit('view-details', questionnaire)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionnaireCard from './QuestionnaireCard.vue'

export default {
  components: { QuestionnaireCard },
  props: {
    questionnaires: Array,
    loading: Boolean,
  },
  emits: ['edit', 'toggle-active', 'view-details'],
  computed: {
    groupedQuestionnaires() {
      if (!this.questionnaires) return []

      const groups = {}

      this.questionnaires.forEach((questionnaire) => {
        if (!groups[questionnaire.name]) {
          groups[questionnaire.name] = {
            name: questionnaire.name,
            versions: [],
          }
        }
        groups[questionnaire.name].versions.push(questionnaire)
      })

      // Sort versions within each group
      Object.values(groups).forEach((group) => {
        group.versions.sort((a, b) => b.version.localeCompare(a.version))
      })

      return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
    },
  },
}
</script>

<style scoped>
.grouped-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.questionnaire-group {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--color-background-soft);
}

.group-title {
  color: var(--color-heading);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.versions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.loading,
.empty {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}
</style>
