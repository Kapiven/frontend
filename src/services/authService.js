import axios from 'axios'

const API_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000'

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    
    if (!response.data.token) {
      throw new Error('Token no recibido del servidor')
    }

    localStorage.setItem('authToken', response.data.token)

    return response.data // Devuelve el objeto completo con token y user
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw new Error('Credenciales inválidas')
  }
}

export async function register(username, email, password) {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password })
    return response.data
  } catch (error) {
    console.error('Error al registrarse:', error)
    throw new Error(error.response?.data?.error || 'Error al registrarse')
  }
}
