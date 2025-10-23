import { api } from './api' // assumes your global axios instance is exported from api.js

// ✅ Get download URL for an exam (no need for a request)
export function getExamDownloadUrl(examId) {
  return `${api.defaults.baseURL}/exams/${examId}/download`
}

// ✅ Fetch exams for a specific patient
export async function getExamsByPatientId(patientId) {
  try {
    const response = await api.get(`/patients/${patientId}/exams`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.error || 'Error al obtener exámenes del paciente'
    console.error(`getExamsByPatientId(${patientId}) error:`, message)
    throw new Error(message)
  }
}

// ✅ Fetch pending exams
export async function getPendingExams() {
  try {
    const response = await api.get(`/exams/pending`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.error || 'Error al obtener exámenes pendientes'
    console.error('getPendingExams error:', message)
    throw new Error(message)
  }
}

// ✅ Search exams by patient name or type
export async function searchExams(query, limit = 10) {
  if (!query || query.length < 2) return []
  try {
    const response = await api.get(`/exams/search`, {
      params: { q: query, limit },
    })
    return response.data
  } catch (error) {
    console.error('searchExams error:', error)
    return []
  }
}

// ✅ Upload exam PDF file
export async function uploadExamPdf(examId, file) {
  try {
    const formData = new FormData()
    formData.append('pdf', file)

    const response = await api.post(`/exams/${examId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  } catch (error) {
    const message = error.response?.data?.error || 'Error al subir el PDF del examen'
    console.error(`uploadExamPdf(${examId}) error:`, message)
    throw new Error(message)
  }
}
