import axios from 'axios'

const API_BASE = 'http://localhost:4000/api/consultations'

export const consultationService = {
  // Create a consultation from questionnaire answers
  async createFromQuestionnaire(data) {
    console.log('📤 Sending POST to /from-questionnaire:', data)
    return axios.post(`${API_BASE}/from-questionnaire`, data)
  },

  // Fetch a single consultation by ID
  async getById(id) {
    return axios.get(`${API_BASE}/${id}`)
  },

  // Fetch a consultation with full details (answers, diagnoses)
  async getWithDetails(id) {
    return axios.get(`${API_BASE}/${id}/details`)
  },

  // Fetch consultations by patient ID
  async getByPatient(patientId) {
    return axios.get(`${API_BASE}/patient/${patientId}`)
  },

  // Update consultation
  async update(id, data) {
    return axios.put(`${API_BASE}/${id}`, data)
  },

  // Delete consultation
  async delete(id) {
    return axios.delete(`${API_BASE}/${id}`)
  },
}
