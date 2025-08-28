<template>
  <div class="section">
    <h2>{{ title }}</h2>
    
    <!-- Search bar -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por paciente o diagnóstico..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      Buscando...
    </div>

    <!-- Diagnostics list -->
    <ul v-else-if="displayDiagnostics.length > 0">
      <li
        v-for="diagnostic in displayDiagnostics"
        :key="diagnostic.id"
        @click="handleItemClick(diagnostic)"
        class="diagnostic-item"
      >
        <div class="item-header">
          <span class="item-type diagnostic">
            Diagnóstico
          </span>
          <span class="item-date">{{ diagnostic.date }}</span>
        </div>
        <div class="item-content">
          <strong>{{ diagnostic.patient }}</strong>
          <p class="item-description">{{ diagnostic.description }}</p>
        </div>
      </li>
    </ul>

    <!-- Empty state -->
    <p v-else-if="!isLoading && searchQuery">
      No se encontraron diagnósticos para "{{ searchQuery }}"
    </p>
    <p v-else-if="!isLoading">
      No hay diagnósticos recientes.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDiagnostics, searchDiagnostics } from '@/services/diagnosticService'
import { getPatientById } from '@/services/patientService'

const props = defineProps({
  title: {
    type: String,
    default: 'Diagnósticos',
  },
})

const emit = defineEmits(['patientRedirect'])

// Reactive state
const searchQuery = ref('')
const diagnostics = ref([])
const isLoading = ref(false)
const searchResults = ref([])

// Computed
const displayDiagnostics = computed(() => {
  if (searchQuery.value.trim()) {
    return searchResults.value
  }
  
  // Show recent diagnostics (sorted by date, most recent first)
  return diagnostics.value.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
})

// Methods
async function fetchRecentDiagnostics() {
  try {
    const diagnosticsData = await getDiagnostics()
    diagnostics.value = await processItems(diagnosticsData)
  } catch (error) {
    console.error('Error fetching diagnostics:', error)
    diagnostics.value = []
  }
}

async function processItems(items) {
  // Get unique patient IDs
  const patientIds = [...new Set(items.map(item => item.patient_id))]
  
  // Fetch patient names
  const patientPromises = patientIds.map(id =>
    getPatientById(id)
      .then(patient => ({ id: patient.id, name: patient.name }))
      .catch(error => {
        console.warn(`Could not fetch name for patient ID ${id}:`, error)
        return { id, name: `Paciente ID: ${id}` }
      })
  )

  const patients = await Promise.all(patientPromises)
  const patientNameMap = new Map(patients.map(p => [p.id, p.name]))

  // Process items with patient names
  return items.map(item => ({
    id: item.id,
    patient_id: item.patient_id,
    patient: patientNameMap.get(item.patient_id) || `Paciente ID: ${item.patient_id}`,
    date: new Date(item.date).toLocaleDateString(),
    description: item.diagnosis,
  }))
}

async function handleSearch() {
  const query = searchQuery.value.trim()
  
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  
  try {
    const diagnosticResults = await searchDiagnostics(query)
    searchResults.value = await processItems(diagnosticResults)
  } catch (error) {
    console.error('Error searching diagnostics:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
}

function handleItemClick(diagnostic) {
  // Redirect to patient page
  emit('patientRedirect', diagnostic.patient_id)
}

// Lifecycle
onMounted(() => {
  fetchRecentDiagnostics()
})
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

.loading-state {
  text-align: center;
  padding: 1rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.diagnostic-item {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: var(--color-background-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.diagnostic-item:hover {
  background: var(--color-background-mute);
  border-color: var(--color-btn-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-type {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.item-type.diagnostic {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.item-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.item-content strong {
  color: var(--color-text);
  font-weight: 600;
}

.item-description {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* Dark mode support */
.dark .diagnostic-item {
  background: var(--color-background-soft);
  border-color: var(--color-border);
}

.dark .diagnostic-item:hover {
  background: var(--color-background-mute);
  border-color: var(--color-btn-primary);
}

.dark .item-type.diagnostic {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}
</style>
