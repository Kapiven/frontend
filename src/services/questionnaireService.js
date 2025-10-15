import { api } from '@/services/api'

export const questionnaireService = {
  async getAll() {
    const response = await api.get(`/questionnaires/all`)
    return response.data
  },

  async getActive() {
    const response = await api.get(`/questionnaires`)
    return response.data
  },

  async getWithQuestions(id) {
    const response = await api.get(`/questionnaires/${id}/questions`)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/questionnaires/${id}`, data)
    return response.data
  },

  async setActive(id, active) {
    const response = await api.patch(`/questionnaires/${id}/active`, { active })
    return response.data
  },
}
