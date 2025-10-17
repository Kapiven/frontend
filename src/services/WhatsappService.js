// src/services/whatsappService.js

export async function sendMessage(telefono, mensaje) {
  console.log(`[SIMULADO] Enviando mensaje a ${telefono}: ${mensaje}`)
  // Simula un pequeño retraso
  await new Promise(resolve => setTimeout(resolve, 500))

  // Devuelve una respuesta simulada
  return { status: 'success', id: Date.now() }
}
