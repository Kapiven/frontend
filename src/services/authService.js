import { api } from '@/services/api'

export async function login(email, password) {
  try {
    const response = await api.post(`/login`, { email, password })

    if (!response.data.token) {
      throw new Error('Token no recibido del servidor')
    }

    localStorage.setItem('authToken', response.data.token)

    return response.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw new Error('Credenciales inválidas')
  }
}

export async function register(username, email, password) {
  try {
    const response = await api.post(`/register`, { username, email, password })
    return response.data
  } catch (error) {
    console.error('Error al registrarse:', error)
    throw new Error(error.response?.data?.error || 'Error al registrarse')
  }
}
