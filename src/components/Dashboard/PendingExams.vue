<template>
  <div class="section">
    <h2>{{ title }}</h2>

    <!-- Search bar -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg
          class="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por paciente o tipo de examen..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <ul>
      <li
        v-for="exam in filteredExams"
        :key="exam.id"
        @click="emit('openExamUploadModal', exam)"
        class="exam-list-item"
      >
        {{ exam.date }} - {{ exam.patient }} ({{ exam.type }})
      </li>
    </ul>

    <p v-if="filteredExams.length === 0 && !searchQuery">No hay exámenes pendientes.</p>
    <p v-if="filteredExams.length === 0 && searchQuery">
      No se encontraron exámenes para "{{ searchQuery }}"
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { searchExams } from '@/services/examService'

const props = defineProps({
  title: { type: String, default: 'Exámenes Pendientes' },
  recentExams: { type: Array, required: true },
})

const emit = defineEmits(['openExamUploadModal'])

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

// Utility to normalize Spanish text (remove tildes and lowercase)
function normalizeText(str) {
  return str
    ? str
        .normalize('NFD') // break accents from letters
        .replace(/[\u0300-\u036f]/g, '') // strip accents
        .toLowerCase()
    : ''
}

// Computed filtered list
const filteredExams = computed(() => {
  const query = normalizeText(searchQuery.value.trim())
  if (!query) return props.recentExams

  // Option A: purely frontend fuzzy search
  return props.recentExams.filter((exam) => {
    const patient = normalizeText(exam.patient || '')
    const type = normalizeText(exam.type || '')
    return patient.includes(query) || type.includes(query)
  })

  // Option B (keep server search)
  // return searchResults.value
})

// Optional: still use backend search for large datasets
watch(searchQuery, async (newQuery) => {
  const query = newQuery.trim()
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const results = await searchExams(query)
    searchResults.value = results.map((exam) => ({
      id: exam.id,
      date: new Date(exam.date).toLocaleDateString(),
      patient: exam.patient_name || `Paciente ID: ${exam.patient_id}`,
      type: exam.type,
      patient_id: exam.patient_id,
      has_file: exam.has_file || false,
    }))
  } catch (error) {
    console.error('Error searching exams:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
})

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
}
</script>

<style scoped>
.search-container {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--color-text-secondary);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-input-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-input-border-focus);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  background: var(--color-background-mute);
  color: var(--color-text);
}
</style>
