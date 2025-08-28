// frontend/src/services/diagnosticService.js

import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000'

// Get all diagnostics
export async function getDiagnostics() {
  try {
    const response = await axios.get(`${API_BASE_URL}/diagnostics`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error('Failed to fetch diagnostics:', error)
    throw error
  }
}

// Search diagnostics by patient name or diagnostic data
export async function searchDiagnostics(query, limit = 10) {
  if (!query || query.length < 2) return []
  try {
    const response = await axios.get(`${API_BASE_URL}/diagnostics/search`, {
      params: { q: query, limit },
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      return []
    }
  } catch (error) {
    console.error('Failed to search diagnostics:', error)
    return []
  }
}

// Get diagnostics by patient ID
export async function getDiagnosticsByPatientId(patientId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients/${patientId}/diagnostics`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to fetch diagnostics for patient ${patientId}:`, error)
    throw error
  }
}
