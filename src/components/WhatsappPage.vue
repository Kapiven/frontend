<template>
  <div class="whatsapp-container">
    <PatientList
      :pacientes="pacientes"
      :selected="pacienteSeleccionado"
      @select="handleSelectPaciente"
    />

    <ChatBox
      v-if="pacienteSeleccionado"
      :paciente="pacienteSeleccionado"
      :mensajes="mensajes"
      @send="handleSendMensaje"
    />

    <div v-else class="chat-box empty-state">Selecciona un paciente para iniciar chat</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PatientList from '@/components/Whatsapp/PatientList.vue'
import ChatBox from '@/components/Whatsapp/chatBox.vue'
import { sendMessage } from '@/services/WhatsappService.js'
import '@/assets/styles/whatsapp.css'

const pacientes = ref([
  { id: 1, nombre: 'Ana López', telefono: '+50255551111' },
  { id: 2, nombre: 'Carlos Méndez', telefono: '+50255552222' },
  { id: 3, nombre: 'María García', telefono: '+50255553333' }
])

const pacienteSeleccionado = ref(null)
const mensajes = ref([])

function handleSelectPaciente(paciente) {
  pacienteSeleccionado.value = paciente
  mensajes.value = [
    { id: 1, texto: 'Hola, ¿cómo se encuentra?', enviado: true },
    { id: 2, texto: 'Muy bien, doctora. Gracias.', enviado: false }
  ]
}

async function handleSendMensaje(mensajeTexto) {
  if (!pacienteSeleccionado.value) return
  mensajes.value.push({
    id: Date.now(),
    texto: mensajeTexto,
    enviado: true
  })
  await sendMessage(pacienteSeleccionado.value.telefono, mensajeTexto)
}
</script>
