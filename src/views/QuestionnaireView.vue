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
    <!-- ✅ Keep the navigation OUTSIDE the constrained content -->
    <AppNavigation class="app-navigation" />

    <main class="questionnaire-page">
      <div class="questionnaire-container">
        <QuestionnaireManager />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Full-page layout */
.questionnaire-wrapper {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* ✅ Separate the nav from the content below it */
.app-navigation {
  flex-shrink: 0;
  width: 100%;
  z-index: 10;
}

/* Main scrollable area */
.questionnaire-page {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Content container */
.questionnaire-container {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  min-height: 80vh;
}
</style>
