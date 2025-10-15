<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

onMounted(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const applyTheme = () => {
    const saved = localStorage.getItem('theme') // 'dark' | 'light' | null
    const doc = document.documentElement
    if (saved === 'dark') {
      doc.classList.add('dark')
    } else if (saved === 'light') {
      doc.classList.remove('dark')
    } else if (mq.matches) {
      doc.classList.add('dark')
    } else {
      doc.classList.remove('dark')
    }
  }
  applyTheme()
  mq.addEventListener('change', applyTheme)
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') applyTheme()
  })
})
</script>

<!-- src/App.vue -->
<template>
  <router-view />
</template>
