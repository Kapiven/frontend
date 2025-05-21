// services/businessHoursService.js
import axios from 'axios'
const API_BASE_URL = 'http://localhost:4000'

export async function getBusinessHoursForDay(dateStr) {
  const res = await axios.get(`${API_BASE_URL}/business-hours`, { params: { date: dateStr } })
  return res.data // [{ start: "08:00", end: "13:00" }, ...]
}

// services/appointmentService.js
export async function getAppointmentsForDay(dateStr) {
  const res = await axios.get(`${API_BASE_URL}/appointments/day`, { params: { date: dateStr } })
  return res.data // [{ id, start, duration, name, ... }]
}

