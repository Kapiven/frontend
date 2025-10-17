<template>
  <div class="message-input">
    <input
      type="text"
      v-model="mensaje"
      placeholder="Escribe un mensaje..."
      @keyup.enter="send"
    />
    <button @click="send">Enviar</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const mensaje = ref('')
const emit = defineEmits(['send'])

function send() {
  if (!mensaje.value.trim()) return
  emit('send', mensaje.value)
  mensaje.value = ''
}
</script>
