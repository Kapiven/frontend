// frontend/src/services/examService.js
import { api } from '@/services/api'

// Build download URL dynamically using Vite env variable
export function getExamDownloadUrl(examId) {
  return `${api.defaults.baseURL}/exams/${examId}/download`
}

export async function getExamsByPatientId(patientId) {
  try {
    const endpoint = `/patients/${patientId}/exams`
    const response = await api.get(endpoint) // <-- use shared `api` instance

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
    const endpoint = `/exams/pending`
    const response = await api.get(endpoint) // <-- use shared `api` instance

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

export async function uploadExamPdf(examId, file) {
  try {
    const formData = new FormData()
    formData.append('pdf', file)

    const url = `/exams/${examId}/upload` // <-- relative path
    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    const errMsg = response.data?.error || `Upload failed (${response.status})`
    throw new Error(errMsg)
  } catch (err) {
    const message = err.response?.data?.error || err.message
    console.error(`uploadExamPdf(${examId}) error:`, message)
    throw new Error(message)
  }
}
