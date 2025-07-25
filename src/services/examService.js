// frontend/src/services/examService.js

import axios from 'axios'

// Define your backend API base URL
// Ensure this matches where your Go backend is running
const API_BASE_URL = 'http://localhost:4000'

// Function to fetch the presigned download URL for a specific exam
export async function getExamDownloadUrl(examId) {
  try {
    const endpoint = `/exams/${examId}/download` // This is the new endpoint we discussed

    // Using axios.get to make the request
    const response = await axios.get(`${API_BASE_URL}${endpoint}`)

    // Check if the request was successful (status code 2xx)
    if (response.status >= 200 && response.status < 300) {
      // Assuming your backend returns { "download_url": "..." }
      return response.data.download_url
    } else {
      // If the backend returns an error message in the response body
      const errorData = response.data || {}
      throw new Error(errorData.error || `API call failed with status ${response.status}`)
    }
  } catch (error) {
    // Axios wraps the actual response error in error.response
    const errorMessage = error.response?.data?.error || error.message
    console.error(`Failed to fetch download URL for exam ID ${examId}:`, errorMessage)
    // Re-throw the error for the component to handle
    throw new Error(errorMessage)
  }
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

// <--- ADD THIS NEW PLACEHOLDER FUNCTION FOR UPLOAD
export async function uploadExamPdf(examId, file) {
  console.warn(`[PLACEHOLDER] Simulating upload for Exam ID: ${examId}, File: ${file.name}`)
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log('[PLACEHOLDER] Upload simulated successfully.')
      resolve({ success: true, message: 'Upload simulated' })
    }, 1000),
  ) // Simulate a 1-second delay
}
