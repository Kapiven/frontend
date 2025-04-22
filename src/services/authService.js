import axios from 'axios';

const API_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000';

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data.token;

    localStorage.setItem('authToken', token);

    return token;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw new Error('Credenciales inválidas');
  }
}

export async function register(email, password) {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data.token;
  } catch (error) {
    console.error('Error al registrarse:', error);
    throw new Error(error.response?.data?.error || 'Error al registrarse');
  }
}