<template>
  <div>
    <h1>MFE 2 - Vue.js</h1>
    <p>Module de liaison compte épargne et placement</p>
    <AccountLinkForm @submit="onSubmit"></AccountLinkForm>
  </div>
</template>

<script setup>
import AccountLinkForm from './AccountLinkForm.vue'

const onSubmit = (data) => {
  console.log('Compte lié:', data)
}
</script>