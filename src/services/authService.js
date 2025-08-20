import axios from 'axios'

const API_URL = 'http://localhost:4000'

export async function login(username, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password })

    localStorage.setItem('authToken', response.data.token)

    return response.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw new Error('Credenciales inválidas')
  }
}

export async function register(email, username, password) {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, username, password })
    return response.data
  } catch (error) {
    console.error('Error al registrarse:', error)
    throw new Error(error.response?.data?.error || 'Error al registrarse')
  }
}
