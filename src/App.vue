<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'

const toggleDarkMode = () => {
  console.log('toggleDarkMode')
}
</script>

<template>
  <div>
    <Navbar @toggle-dark-mode="toggleDarkMode" />
    <RouterView />
  </div>
</template>

<style scoped></style>
