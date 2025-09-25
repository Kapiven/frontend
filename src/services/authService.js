import axios from 'axios'

const API_URL = 'http://localhost:4000'

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email: String(email).trim().toLowerCase(), password })

    localStorage.setItem('authToken', response.data.token)

    return response.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    const backendMsg = error.response?.data?.message || error.response?.data || null
    throw new Error(backendMsg || 'Credenciales inválidas')
  }
}

export async function register(email, username, password) {
  try {
    const response = await axios.post(`${API_URL}/register`, { email: String(email).trim().toLowerCase(), username: String(username).trim(), password })
    return response.data
  } catch (error) {
    console.error('Error al registrarse:', error)
    throw new Error(error.response?.data?.error || 'Error al registrarse')
  }
}
