<template>
  <div class="chat-box">
    <!-- Encabezado del chat -->
    <div class="chat-header">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div
          style="width: 36px; height: 36px; border-radius: 50%; background: #e8f0fe; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #1a73e8;"
        >
          {{ (props.paciente?.nombre?.[0] || 'P').toUpperCase() }}
        </div>
        <div>
          <div style="font-weight: 600; color: #1e293b;">{{ props.paciente?.nombre || 'Paciente' }}</div>
          <div style="font-size: 0.85rem; color: #64748b;">{{ props.paciente?.telefono || 'Sin número registrado' }}</div>
        </div>
      </div>
    </div>

    <!-- Mensajes -->
    <div class="chat-messages" ref="messagesRef">
      <div
        v-for="(msg, index) in props.mensajes"
        :key="msg.id ?? index"
        :class="['message', msg.enviado ? 'sent' : 'received']"
      >
        <p style="margin: 0;">{{ msg.texto }}</p>
      </div>
    </div>

    <!-- Input de mensaje -->
    <MessageInput class="message-input" @send="onSend" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, nextTick, onMounted } from 'vue'
import MessageInput from './MessageInput.vue'

const props = defineProps({
  paciente: Object,
  mensajes: { type: Array, default: () => [] }
})

const emit = defineEmits(['send'])
const messagesRef = ref(null)

const scrollToBottom = () => {
  if (!messagesRef.value) return
  messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}

onMounted(() => {
  scrollToBottom()
})

watch(
  () => props.mensajes.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

const onSend = (texto) => {
  emit('send', texto)
}
</script>
