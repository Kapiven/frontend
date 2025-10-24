import axios from 'axios'

// Try to use the build-time env var first.
// Fallback to relative API or backend service automatically.
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.origin.replace(/:\d+$/, ':4000')}`
    : 'http://backend:4000')

// DEBUG — remove when stable
console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL)
console.log('API_BASE_URL:', API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
})
