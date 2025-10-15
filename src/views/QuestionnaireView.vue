<script>
import AppNavigation from '@/components/AppNavigation.vue'
import QuestionnaireManager from '../components/Questionnaire/QuestionnaireManager.vue'

export default {
  components: {
    AppNavigation,
    QuestionnaireManager,
  },
}
</script>

<template>
  <div class="questionnaire-wrapper">
    <AppNavigation />

    <div class="questionnaire-page">
      <div class="questionnaire-container">
        <QuestionnaireManager />
      </div>
    </div>
  </div>
</template>

<style scoped>
.questionnaire-wrapper {
  min-height: 100vh;
  background-color: var(--color-background-soft);
}

.questionnaire-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.questionnaire-container {
  background: var(--color-card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px var(--color-card-shadow);
  border: 1px solid var(--color-card-border);
}

.questionnaire-wrapper {
  min-height: 100vh;
  background-color: var(--color-background-soft);
}

.questionnaire-page {
  padding: 1.5rem;
  max-width: 1400px; /* Increased from 1200px */
  margin: 0 auto;
}

.questionnaire-container {
  background: var(--color-card-bg);
  border-radius: 16px; /* More rounded */
  padding: 2.5rem; /* More padding */
  box-shadow: 0 4px 20px var(--color-card-shadow); /* Better shadow */
  border: 1px solid var(--color-card-border);
  min-height: 80vh; /* Takes up more vertical space */
}
</style>
