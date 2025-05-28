<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

onMounted(() => {
  const setDarkClass = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  setDarkClass()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setDarkClass)
})
</script>

<!-- src/App.vue -->
<template>
  <router-view />
</template>
