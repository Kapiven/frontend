import { api } from '@/services/api'

export const questionnaireService = {
  async getAll() {
    const response = await api.get(`/api/questionnaires/all`)
    return response.data
  },

  async getActive() {
    const response = await api.get(`/api/questionnaires`)
    return response.data
  },

  async getWithQuestions(id) {
    const response = await api.get(`/api/questionnaires/${id}/questions`)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/api/questionnaires/${id}`, data)
    return response.data
  },

  async setActive(id, active) {
    const response = await api.patch(`/api/questionnaires/${id}/active`, { active })
    return response.data
  },
}
