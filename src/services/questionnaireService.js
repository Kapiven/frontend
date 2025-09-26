import axios from 'axios'

const API_BASE = 'http://localhost:4000/api'

export const questionnaireService = {
  async getAll() {
    const response = await axios.get(`${API_BASE}/questionnaires/all`)
    return response.data
  },

  async getActive() {
    const response = await axios.get(`${API_BASE}/questionnaires`)
    return response.data
  },

  async getWithQuestions(id) {
    const response = await axios.get(`${API_BASE}/questionnaires/${id}/questions`)
    return response.data
  },

  async update(id, data) {
    const response = await axios.put(`${API_BASE}/questionnaires/${id}`, data)
    return response.data
  },

  async setActive(id, active) {
    const response = await axios.patch(`${API_BASE}/questionnaires/${id}/active`, { active })
    return response.data
  },
}
