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

export const getPatientDetails = async (patientId) => {
  try {
    const patientInfoPromise = axios.get(`${API_BASE_URL}/patients/${patientId}`)
    const consultationsPromise = axios.get(`${API_BASE_URL}/consultations/patient/${patientId}`)
    const examsPromise = axios.get(`${API_BASE_URL}/patients/${patientId}/exams`)

    const [patientInfoResponse, consultationsResponse, examsResponse] = await Promise.all([
      patientInfoPromise,
      consultationsPromise,
      examsPromise,
    ])

    const patientInfo = patientInfoResponse.data
    const consultations = consultationsResponse.data
    const exams = examsResponse.data

    const patientData = {
      id: patientInfo.id,
      name: patientInfo.name,
      birthDate: patientInfo.date_of_birth,
      gender: patientInfo.sex,
      phone: patientInfo.phone,

      allergies: patientInfo.antecedentes?.alergic,
      ocularHistory: patientInfo.antecedentes?.ocular,
      medicalHistory: patientInfo.antecedentes?.medical,
      familyHistory: patientInfo.antecedentes?.family,
      otherHistory: patientInfo.antecedentes?.other, // Add other history if needed
      consultations: consultations.map((c) => ({
        id: c.id || Math.random(), // API response doesn't have 'id', add a fallback or generate one
        reason: c.reason, // Map 'motive' to 'reason'
        date: c.date,
      })),

      exams: exams.map((e) => ({
        id: e.id || Math.random(),
        name: e.type,
        date: e.date,
      })),
    }

    return patientData
  } catch (error) {
    console.error(`Error fetching details for patient ${patientId}:`, error)
    throw error
  }
}

// Function to update patient information
export async function updatePatient(patientId, patientData) {
  try {
    // Update patient contact information (telefono)
    if (patientData.telefono !== undefined) {
      const patientUpdateData = { telefono: patientData.telefono }
      await axios.put(`${API_BASE_URL}/patients/${patientId}`, patientUpdateData)
    }

    // Update antecedentes (medical backgrounds)
    if (
      patientData.medicos !== undefined ||
      patientData.oculares !== undefined ||
      patientData.alergicos !== undefined
    ) {
      const antecedentesData = {
        medicos: patientData.medicos,
        oculares: patientData.oculares,
        alergicos: patientData.alergicos,
      }
      await axios.put(`${API_BASE_URL}/patients/${patientId}/antecedentes`, antecedentesData)
    }

    return { success: true }
  } catch (error) {
    console.error(`Failed to update patient with ID ${patientId}:`, error)
    throw error
  }
}
