// Assume this file is in your frontend project at src/services/appointmentService.js

import axios from 'axios' // Using Axios

// Define your backend API base URL
const API_BASE_URL = 'http://localhost:4000' // Your backend's URL

// Function to fetch appointments for a specific month
// Calls the backend's /appointments/month endpoint (assuming public)
export async function getAppointmentsForMonth(year, month) {
  try {
    // The backend expects 'year' and 'month' query parameters.
    const endpoint = `/appointments/month?year=${year}&month=${month}` // Adjust path if needed

    // Use axios directly for public endpoint
    const response = await axios.get(`${API_BASE_URL}${endpoint}`) // <--- Use axios.get directly

    // Check if the request was successful (status code 2xx)
    if (response.status >= 200 && response.status < 300) {
      // The backend returns data grouped by date
      return response.data
    } else {
      // Handle non-successful responses
      const errorData = response.data || {}
      throw new Error(errorData.message || `API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to fetch appointments for month ${month}/${year}:`, error)
    // Re-throw the error so the calling component can handle it
    throw error
  }
}

// Function to fetch appointments for today
// Calls the backend's /appointments/today endpoint (assuming public)
export async function getTodaysAppointments() {
  try {
    const endpoint = `/appointments/today` // Adjust path if needed

    // Use axios directly for public endpoint
    const response = await axios.get(`${API_BASE_URL}${endpoint}`) // <--- Use axios.get directly

    // Check if the request was successful (status code 2xx)
    if (response.status >= 200 && response.status < 300) {
      // The backend returns data grouped by date (likely just today's date key)
      return response.data
    } else {
      const errorData = response.data || {}
      throw new Error(errorData.message || `API call failed with status ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to fetch today's appointments:`, error)
    throw error
  }
}

export async function getAppointmentsForDate(dateStr) {
  // dateStr should be "YYYY-MM-DD"
  const res = await axios.get(`${API_BASE_URL}/appointments/day`, {
    params: { date: dateStr },
  })
  return res.data // Array of appointments
}

export async function deleteAppointment(id) {
  const res = await axios.delete(`${API_BASE_URL}/appointments/${id}`)
  return res.status === 204 // true if deleted
}

/**
 * Create a new appointment.
 * @param {Object} appointment - The appointment data.
 * @param {number|null} appointment.patient_id - Patient ID or null for new patient.
 * @param {string} appointment.name - Patient name.
 * @param {string} appointment.start - ISO 8601 datetime string (with timezone).
 * @param {number} appointment.duration - Duration in seconds or nanoseconds (match backend).
 * @returns {Promise<Object>} The created appointment.
 */
export async function createAppointment(appointment) {
  const res = await axios.post(`${API_BASE_URL}/appointments`, appointment)
  return res.data
}

/**
 * Update an existing appointment.
 * @param {Object} appointment - The appointment data.
 * @param {number} appointment.id - The appointment ID.
 * @param {number|null} appointment.patient_id
 * @param {string} appointment.name
 * @param {string} appointment.start - ISO 8601 string
 * @param {number} appointment.duration - Duration in nanoseconds
 * @param {string} [appointment.notes]
 * @returns {Promise<Object>} The updated appointment (if your backend returns it)
 */
export async function updateAppointment(appointment) {
  if (!appointment.id) throw new Error('Appointment ID is required for update')
  // You can send the full object, or just the fields you want to update
  const res = await axios.put(`${API_BASE_URL}/appointments/${appointment.id}`, appointment)
  return res.data
}
