// frontend/src/services/treatmentService.js

import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000'

// Get all treatments
export async function getTreatments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/treatments`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error('Failed to fetch treatments:', error)
    throw error
  }
}

// Search treatments by patient name or treatment data
export async function searchTreatments(query, limit = 10) {
  if (!query || query.length < 2) return []
  try {
    const response = await axios.get(`${API_BASE_URL}/treatments/search`, {
      params: { q: query, limit },
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      return []
    }
  } catch (error) {
    console.error('Failed to search treatments:', error)
    return []
  }
}

// Get treatments by patient ID
export async function getTreatmentsByPatientId(patientId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients/${patientId}/treatments`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to fetch treatments for patient ${patientId}:`, error)
    throw error
  }
}
