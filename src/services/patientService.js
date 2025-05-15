// frontend/src/services/patientService.js

import axios from 'axios'

// Define your backend API base URL (adjust if different from appointment service)
const API_BASE_URL = 'http://localhost:4000' // Your backend's URL

// Import the helper function for authenticated API calls if using auth
// import { authenticatedApiCall } from './authService'; // Use if /patients/:id is protected

// Function to fetch patient details by ID (assuming public endpoint for now)
// Adjust to use authenticatedApiCall if /patients/:id is protected
export async function getPatientById(patientId) {
  try {
    const endpoint = `/patients/${patientId}` // Adjust path if needed (e.g., /api/v1/patients/:id)

    // Use axios directly for public endpoint
    const response = await axios.get(`${API_BASE_URL}${endpoint}`) // <--- Use axios.get directly

    // Check if the request was successful (status code 2xx)
    if (response.status >= 200 && response.status < 300) {
      return response.data // Assuming backend returns the Patient model
    } else {
      const errorData = response.data || {}
      throw new Error(errorData.message || `API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to fetch patient with ID ${patientId}:`, error)
    // Re-throw the error
    throw error
  }
}
export async function searchPatients(query, limit = 10) {
  if (!query || query.length < 2) return []
  try {
    const response = await axios.get(`${API_BASE_URL}/patients/search`, {
      params: { q: query, limit },
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      return []
    }
  } catch (error) {
    console.error('Failed to search patients:', error)
    return []
  }
}
// You can add other functions for patient-related API calls here:
// export async function listPatients() { ... }
// export async function createPatient(patientData) { ... }
// export async function updatePatient(patientId, updatedData) { ... }
// export async function deletePatient(patientId) { ... }

