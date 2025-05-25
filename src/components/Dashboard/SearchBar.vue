<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      @input="onSearchInput"
      placeholder="Buscar paciente..."
      autocomplete="off"
    />
    <SuggestionsList
      :suggestions="suggestions"
      :visible="showSuggestions"
      :query="searchQuery"
      @select="selectPatient"
    />
  </div>
</template>

<script setup>
import SuggestionsList from './SuggestionsList.vue'
import { ref } from 'vue'
import { searchPatients } from '@/services/patientService'
import debounce from 'lodash.debounce'


// Estado interno
const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)

// Métodos
const fetchSuggestions = debounce(async (q) => {
  if (!q || q.length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  const results = await searchPatients(q)
  suggestions.value = results
  if (results) {
    showSuggestions.value = results.length > 0
  }
}, 150)

function onSearchInput() {
  fetchSuggestions(searchQuery.value)
  console.log('Input:', searchQuery.value)
}

function selectPatient(patient) {
  searchQuery.value = patient.name
  showSuggestions.value = false
  patientRedirect(patient.id)
}

function patientRedirect(patientId) {
  alert(`Redirigir a pagina del paciente con ID ${patientId}`)
}
</script>

<style src="@/assets/styles/searchbar.css"></style>