// frontend/src/services/examService.js

import axios from 'axios'

// Define your backend API base URL
// Ensure this matches where your Go backend is running
const API_BASE_URL = 'http://localhost:4000'
// Remove the getExamDownloadUrl function entirely
// OR replace it with this simple helper:
export function getExamDownloadUrl(examId) {
  return `${API_BASE_URL}/exams/${examId}/download`
}

// You might also want a function here to fetch the list of exams by patient ID
// (though you are already doing it in getPatientDetails, it's good practice
// to have it here if other parts of the app need it separately)
export async function getExamsByPatientId(patientId) {
  try {
    const endpoint = `/patients/${patientId}/exams`
    const response = await axios.get(`${API_BASE_URL}${endpoint}`)

    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorData = response.data || {}
      throw new Error(errorData.error || `API call failed with status ${response.status}`)
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message
    console.error(`Failed to fetch exams for patient ${patientId}:`, errorMessage)
    throw new Error(errorMessage)
  }
}

export async function getPendingExams() {
  try {
    const endpoint = `/exams/pending` // The endpoint you just created in the backend

    const response = await axios.get(`${API_BASE_URL}${endpoint}`)

    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      const errorData = response.data || {}
      throw new Error(errorData.error || `API call failed with status ${response.status}`)
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message
    console.error('Failed to fetch pending exams:', errorMessage)
    throw new Error(errorMessage)
  }
}
//
// // <--- ADD THIS NEW PLACEHOLDER FUNCTION FOR UPLOAD
// export async function uploadExamPdf(examId, file) {
//   console.warn(`[PLACEHOLDER] Simulating upload for Exam ID: ${examId}, File: ${file.name}`)
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       console.log('[PLACEHOLDER] Upload simulated successfully.')
//       resolve({ success: true, message: 'Upload simulated' })
//     }, 1000),
//   ) // Simulate a 1-second delay
// }
//
export async function uploadExamPdf(examId, file) {
  try {
    // Build FormData
    const formData = new FormData()
    formData.append('pdf', file)

    // POST to /exams/:examId/upload
    const url = `${API_BASE_URL}/exams/${examId}/upload`
    const response = await axios.post(url, formData, {
      headers: {
        // Let axios set the proper boundary
        'Content-Type': 'multipart/form-data',
      },
    })

    // Check for 2xx
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    // Non-2xx → throw
    const errMsg = response.data?.error || `Upload failed (${response.status})`
    throw new Error(errMsg)
  } catch (err) {
    // Normalize error message
    const message = err.response?.data?.error || err.message
    console.error(`uploadExamPdf(${examId}) error:`, message)
    throw new Error(message)
  }
}
