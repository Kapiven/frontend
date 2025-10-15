// services/businessHoursService.js
import { api } from '@/services/api'

export async function getBusinessHoursForDay(dateStr) {
  const res = await api.get(`/business-hours`, { params: { date: dateStr } })
  return res.data // [{ start: "08:00", end: "13:00" }, ...]
}

// services/appointmentService.js
export async function getAppointmentsForDay(dateStr) {
  const res = await api.get(`/appointments/day`, { params: { date: dateStr } })
  return res.data // [{ id, start, duration, name, ... }]
}
