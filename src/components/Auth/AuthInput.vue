<template>
  <div class="auth-input">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: String,
  placeholder: String,
  modelValue: String,
})
defineEmits(['update:modelValue'])
</script>