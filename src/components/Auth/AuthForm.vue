<template>
  <form class="auth-form" @submit.prevent="onSubmit">
    <slot />
    <button type="submit" class="auth-button">{{ buttonText }}</button>
  </form>
</template>

<script setup>
defineProps({
  onSubmit: Function,
  buttonText: String
})
</script>