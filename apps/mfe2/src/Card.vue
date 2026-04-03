<template>
  <div class="vue-card">
    <h3>{{ title }}</h3>
    <div><slot></slot></div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.vue-card {
  border: 1px solid #42b883;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.vue-card h3 {
  margin: 0 0 12px 0;
  color: #42b883;
}
</style>