<template>
  <div class="reminders">
    <header class="page-header">
      <div class="titles">
        <h1>Recordatorios</h1>
        <p class="subtitle">Crea recordatorios manuales o programa recordatorios automáticos.</p>
      </div>
      <button class="btn primary" @click="abrirModal">+ Nuevo recordatorio</button>
    </header>

    <!--<section class="toolbar">
      <div class="filters">
        <div class="segment">
          <button :class="{ active: filtroTipo === 'all' }" @click="filtroTipo = 'all'">Todos</button>
          <button :class="{ active: filtroTipo === 'manual' }" @click="filtroTipo = 'manual'">Manuales</button>
          <button :class="{ active: filtroTipo === 'auto' }" @click="filtroTipo = 'auto'">Automáticos</button>
        </div>
        <input class="search" v-model.trim="busqueda" placeholder="Buscar paciente..." />
      </div>
    </section>-->

    <div class="card table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Paciente</th>
            <!--<th>Tipo</th> -->
            <th>Fecha</th>
            <th>Hora</th>
            <th>Frecuencia</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th>Próxima ejecución</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in recordatoriosFiltrados" :key="r.id">
            <td class="paciente">
              <div class="stack">
                <span class="name">{{ (r.paciente && r.paciente.nombre) ? r.paciente.nombre : '—' }}</span>
              </div>
            </td>
            <!--<td>
              <span class="badge" :class="r.automatico ? 'auto' : 'manual'">{{ r.automatico ? 'Automático' : 'Manual' }}</span>
            </td> -->
            <td>{{ formatearFecha(r.fecha) }}</td>
            <td>{{ r.hora || '—' }}</td>
            <td>
              <span v-if="r.automatico">{{ formatearFrecuencia(r) }}</span>
              <span v-else>—</span>
            </td>
            <td class="mensaje" :title="r.mensaje">{{ r.mensaje }}</td>
            <td>
              <span v-if="r.automatico" class="badge" :class="r.activo ? 'activo' : 'pausado'">{{ r.activo ? 'Activo' : 'Pausado' }}</span>
              <span v-else class="badge" :class="r.estado">{{ capitalizar(r.estado) }}</span>
            </td>
            <td>
              <div v-if="r.automatico" class="muted">{{ r.siguienteEjecucion ? formatearFechaHora(r.siguienteEjecucion) : '—' }}</div>
              <div v-else>—</div>
            </td>
            <td class="acciones text-right">
              <button v-if="!r.automatico" class="btn sm" @click="enviar(r)">Enviar</button>
              <label v-else class="switch" :title="r.activo ? 'Desactivar' : 'Activar'">
                <input type="checkbox" v-model="r.activo" />
                <span class="slider"></span>
              </label>
              <button class="icon danger" title="Eliminar" @click="eliminar(r.id)">🗑</button>
            </td>
          </tr>
          <tr v-if="recordatoriosFiltrados.length === 0">
            <td colspan="9" class="empty">No se encontraron recordatorios con los filtros actuales.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para nuevo recordatorio -->
    <div v-if="mostrarModal" class="overlay">
      <div class="modal">
        <header class="modal-header">
          <h2>Nuevo recordatorio</h2>
          <button class="icon" @click="cerrarModal" aria-label="Cerrar">✕</button>
        </header>

        <div class="form-grid">
          <div class="field">
            <label>Paciente</label>
            <input v-model="form.paciente.nombre" placeholder="Nombre del paciente" />
          </div>

          <!--<div class="field">
            <label>Tipo</label>
            <div class="segment small segment-toggle">
              <button :class="{ active: !form.automatico }" @click="form.automatico = false">Manual</button>
              <button :class="{ active: form.automatico }" @click="form.automatico = true">Automático</button>
            </div>
          </div> -->

          <template v-if="!form.automatico">
            <div class="field">
              <label>Fecha</label>
              <input type="date" v-model="form.fecha" />
            </div>
            <div class="field">
              <label>Hora</label>
              <input type="time" v-model="form.hora" />
            </div>
          </template>

          <template v-else>
            <div class="field">
              <label>Inicio (fecha)</label>
              <input type="date" v-model="form.fecha" />
            </div>
            <div class="field">
              <label>Inicio (hora)</label>
              <input type="time" v-model="form.hora" />
            </div>
            <div class="field">
              <label>Frecuencia</label>
              <div class="freq">
                <input type="number" min="1" v-model.number="form.intervalo" />
                <select v-model="form.unidad">
                  <option value="minutos">minutos</option>
                  <option value="horas">horas</option>
                  <option value="dias">días</option>
                  <option value="semanas">semanas</option>
                </select>
              </div>
            </div>
            <div class="field inline">
              <label>Activo</label>
              <label class="switch">
                <input type="checkbox" v-model="form.activo" />
                <span class="slider"></span>
              </label>
            </div>
          </template>

          <div class="field field-col">
            <label>Mensaje</label>
            <textarea v-model="form.mensaje" rows="3" placeholder="Escribe el mensaje..."></textarea>
          </div>
        </div>

        <footer class="modal-actions">
          <button class="btn primary" @click="guardar">Guardar</button>
          <button class="btn ghost" @click="cerrarModal">Cancelar</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Estado principal
const recordatorios = ref([
  {
    id: 1,
    automatico: true,
    paciente: { nombre: 'María López' },
    fecha: '2025-10-20',
    hora: '09:00',
    mensaje: 'Recordatorio de cita de revisión ocular mañana.',
    estado: 'pendiente',
  },
  {
    id: 2,
    automatico: true,
    paciente: { nombre: 'Juan Pérez' },
    fecha: '2025-10-15',
    hora: '10:30',
    mensaje: 'Recordatorio automático de tratamiento.',
    activo: true,
    unidad: 'dias', // minutos | horas | dias | semanas
    intervalo: 7,
    siguienteEjecucion: null, // se calculará al iniciar
  },
])

// Filtros
const busqueda = ref('')
const filtroTipo = ref('all') // all | manual | auto

const recordatoriosFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  return recordatorios.value
    .filter((r) => {
      if (filtroTipo.value === 'manual' && r.automatico) return false
      if (filtroTipo.value === 'auto' && !r.automatico) return false
      if (!q) return true
      const name = r && r.paciente && r.paciente.nombre ? String(r.paciente.nombre) : ''
      return name.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      // Ordenar: automáticos activos primero por próxima ejecución, luego manuales por fecha
      if (a.automatico && b.automatico) {
        const an = a.siguienteEjecucion ? new Date(a.siguienteEjecucion).getTime() : Infinity
        const bn = b.siguienteEjecucion ? new Date(b.siguienteEjecucion).getTime() : Infinity
        return an - bn
      }
      if (a.automatico !== b.automatico) return a.automatico ? -1 : 1
      const ad = a.fecha || ''
      const bd = b.fecha || ''
      return ad.localeCompare(bd)
    })
})

// Modal
const mostrarModal = ref(false)
const form = ref({
  automatico: true,
  paciente: { nombre: '' },
  fecha: '',
  hora: '',
  mensaje: '',
  // automáticos
  activo: true,
  unidad: 'dias',
  intervalo: 1,
})

function abrirModal() {
  mostrarModal.value = true
}
function cerrarModal() {
  mostrarModal.value = false
}

function validar() {
  if (!form.value.paciente.nombre) return false
  if (form.value.automatico) {
    if (!form.value.fecha || !form.value.hora) return false
    if (!form.value.intervalo || form.value.intervalo < 1) return false
    return true
  } else {
    if (!form.value.fecha || !form.value.hora) return false
    return true
  }
}

function guardar() {
  if (!validar()) return
  const nuevo = {
    id: Date.now(),
    automatico: form.value.automatico,
    paciente: { nombre: form.value.paciente.nombre },
    fecha: form.value.fecha,
    hora: form.value.hora,
    mensaje: form.value.mensaje,
  }
  if (form.value.automatico) {
    Object.assign(nuevo, {
      activo: form.value.activo,
      unidad: form.value.unidad,
      intervalo: form.value.intervalo,
      siguienteEjecucion: combinarFechaHora(form.value.fecha, form.value.hora).toISOString(),
    })
    // Si la fecha/hora inicial ya pasó, calcular la próxima en el futuro
    nuevo.siguienteEjecucion = proximaEjecucionFutura(nuevo)
  } else {
    nuevo.estado = 'pendiente'
  }

  recordatorios.value.push(nuevo)
  cerrarModal()
  resetForm()
}

function resetForm() {
  form.value = {
    automatico: true,
    paciente: { nombre: '' },
    fecha: '',
    hora: '',
    mensaje: '',
    activo: true,
    unidad: 'dias',
    intervalo: 1,
  }
}

// Envíos
function enviar(r) {
  if (r.automatico) return // manual solamente
  r.estado = 'enviado'
  r.enviadoEn = new Date().toISOString()
  // Aquí iría la llamada real a la API/WhatsApp
  console.log('Enviando recordatorio manual:', r)
}

function enviarAutomatico(r) {
  // Aquí iría la llamada real a la API/WhatsApp
  console.log('Enviando recordatorio automático:', {
    id: r.id,
    paciente: r.paciente?.nombre,
    mensaje: r.mensaje,
    ejecutadoEn: new Date().toISOString(),
  })
  r.ultimoEnvio = new Date().toISOString()
  // Programar siguiente
  r.siguienteEjecucion = sumarIntervalo(new Date(r.siguienteEjecucion), r.intervalo, r.unidad).toISOString()
}

// Utilidades de fecha y programación
function combinarFechaHora(fechaStr, horaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number)
  const [hh, mm] = (horaStr || '00:00').split(':').map(Number)
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh || 0, mm || 0))
  return dt
}

function sumarIntervalo(date, intervalo, unidad) {
  const d = new Date(date)
  switch (unidad) {
    case 'minutos':
      d.setUTCMinutes(d.getUTCMinutes() + intervalo)
      break
    case 'horas':
      d.setUTCHours(d.getUTCHours() + intervalo)
      break
    case 'dias':
      d.setUTCDate(d.getUTCDate() + intervalo)
      break
    case 'semanas':
      d.setUTCDate(d.getUTCDate() + intervalo * 7)
      break
    default:
      d.setUTCDate(d.getUTCDate() + intervalo)
  }
  return d
}

function proximaEjecucionFutura(r) {
  if (!r.siguienteEjecucion) return null
  let next = new Date(r.siguienteEjecucion)
  const ahora = new Date()
  let guard = 0
  while (next <= ahora && guard < 1000) {
    next = sumarIntervalo(next, r.intervalo, r.unidad)
    guard++
  }
  return next.toISOString()
}

// Formatos
function formatearFecha(isoDateString) {
  if (!isoDateString) return '—'
  const [y, m, d] = isoDateString.split('-')
  return `${d}/${m}/${y}`
}
function formatearFechaHora(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const yy = d.getUTCFullYear()
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mi = String(d.getUTCMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yy} ${hh}:${mi}`
}
function formatearFrecuencia(r) {
  const u = r.unidad || 'dias'
  const n = r.intervalo || 1
  const singular = u.replace(/s$/, '')
  return `Cada ${n} ${n === 1 ? singular : u}`
}
function capitalizar(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Scheduler simple en frontend (demo)
let timer = null
onMounted(() => {
  // Inicializar próximas ejecuciones de automáticos existentes
  recordatorios.value.forEach((r) => {
    if (r.automatico) {
      if (!r.siguienteEjecucion) {
        r.siguienteEjecucion = combinarFechaHora(r.fecha, r.hora).toISOString()
      }
      r.siguienteEjecucion = proximaEjecucionFutura(r)
    }
  })

  timer = setInterval(() => {
  const ahora = new Date()
  recordatorios.value.forEach((r) => {
  if (r.automatico && r.activo && r.siguienteEjecucion) {
  const next = new Date(r.siguienteEjecucion)
  if (!isNaN(next.getTime()) && next <= ahora) {
  enviarAutomatico(r)
  }
  }
  })
  }, 10000) // cada 10s para demo
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// Operaciones
function eliminar(id) {
  recordatorios.value = recordatorios.value.filter((r) => r.id !== id)
}
</script>

<style scoped>
:root {
  --bg: #f6f8fb;
  --card: #ffffff;
  --border: #e6edf7;
  --text: #1f2a44;
  --muted: #334155;
  --primary: #0ea5e9;
  --primary-600: #0284c7;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}

.reminders {
  padding: 24px;
  background: var(--bg);
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  color: var(--text);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.titles h1 {
  margin: 0;
  font-size: 24px;
  color: #104F55;
  font-weight:500;
}
.subtitle {
  margin: 4px 0 0;
  color:#1f2a44 ;
  font-size: 14px;
  font-weight: 400;
}

.toolbar {
  margin-bottom: 16px;
}
.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.segment {
  display: inline-flex;
  background:#eef6ff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}
.segment.small {
  padding: 2px;
}
/* Toggle de dos opciones a 50/50 */
.segment-toggle {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.segment-toggle > button {
  width: 100%;
  justify-content: center;
}
.segment > button {
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: rgb(8, 62, 91);
  cursor: pointer;
  font-weight: 600;
}
.segment.small > button {
  padding: 6px 10px;
  font-size: 12px;
}
.segment > button.active {
  background: var(--card);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.search {
  width: 260px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
}

.card.table-card {
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(142, 156, 185, 0.08);
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.table thead th {
  background: #eef6ff;
  text-align: left;
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgb(8, 71, 109);
  border-bottom: 1px solid #dbeafe;
}
.table tbody td {
  padding: 14px;
  border-bottom: 1px solid #dbeafe;
  vertical-align: middle;
  background: transparent;
  color: black;
}

.table tbody tr { background: #f9fbff; }
.table tbody tr:nth-child(odd) { background: #ffffff; }
.table tbody tr:hover { background: #e6f0ff; }

.paciente .name {
  font-weight: 600;
}
.mensaje {
  max-width: 380px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.badge.manual {
  background: #eef6ff;
  color: #0e7490;
}
.badge.auto {
  background: #ecfeff;
  color: #0e7490;
}
.badge.pendiente {
  background: #fff7ed;
  color: #c2410c;
}
.badge.enviado {
  background: #ecfdf5;
  color: #047857;
}
.badge.activo {
  background: #ecfdf5;
  color: #047857;
}
.badge.pausado {
  background: #f1f5f9;
  color: #0f172a;
}

.muted {
  color: var(--muted);
  font-size: 12px;
}

.acciones {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
.table .acciones .btn.sm {
  height: 32px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
}
.table .acciones .icon {
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.table .acciones button:focus { outline: none; }
.table .acciones button:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

.btn {
  background: #eef6ff;
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  font-weight: 700;
}
.btn.primary {
  background: var(--primary);
  color: #fff;
  border: 1px solid var(--primary-600);
}
.btn.ghost {
  background: #ef5050;
}
.btn.sm {
  padding: 6px 10px;
  font-size: 12px;
  color: #104f55
}

.icon {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}
.icon.danger {
  color: black;
}

.text-right { text-align: right; }

.empty {
  text-align: center;
  color: var(--muted);
  padding: 24px;
}

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(161, 193, 233, 0.45);
  display: grid;
  place-items: center;
  z-index: 50;
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
}
.modal {
  width: 720px;
  max-width: calc(100vw - 24px);
  background: rgba(248, 251, 255, 0.92);
  border: 1px solid rgba(219, 234, 254, 0.9);
  border-radius: 12px;
  box-shadow: 0 24px 72px rgba(2, 8, 20, 0.45);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
  color: black
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  padding: 8px 16px 16px;
}
.field { display: grid; gap: 6px; }
.field-col { grid-column: 1 / -1; }
.field.inline { align-items: center; grid-auto-flow: column; grid-auto-columns: max-content; }
label { font-size: 12px; font-weight: 700; color: #1f2a44; }
input, select, textarea {
  padding: 10px 12px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #f8fbff;
  color: #334155;
}
textarea { resize: vertical; }
.modal input::placeholder,
.modal textarea::placeholder {
  color: #334155;
  opacity: 1;
}
.freq { display: flex; gap: 8px; align-items: center; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px 16px;
  background:transparent;
  border-top: 1px solid rgba(219, 234, 254, 0.9);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  color: var(--text);
}

/* Switch */
.switch { position: relative; display: inline-block; width: 52px; height: 32px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: #e5e7eb; transition: .2s; border-radius: 999px; }
.slider:before { content: ""; position: absolute; height: 24px; width: 24px; left: 4px; top: 4px; background: white; transition: .2s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.switch input:checked + .slider { background: var(--primary); }
.switch input:checked + .slider:before { transform: translateX(20px); }

@media (max-width: 920px) {
  .mensaje { max-width: 240px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
