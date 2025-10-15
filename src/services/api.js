import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://18.219.58.209:4000'

// DEBUG - remove after we figure this out
console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL)
console.log('API_BASE_URL:', API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
})
