<script setup lang="ts">
import { useDarkModeStore } from '@/stores/darkMode'

const darkModeStore = useDarkModeStore()
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <h1 class="site-name">Where in the World</h1>
      </div>

      <button @click="() => darkModeStore.toggleDarkMode()" class="dark-mode-toggle">
        <span class="toggle-icon">{{ darkModeStore.isDarkMode ? '☀️' : '🌙' }}</span>
        {{ darkModeStore.isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--color-background-soft);
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 2px 8px var(--color-shadow);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  height: 60px;
  padding: 0 1rem;
}

.site-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
}

.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.dark-mode-toggle:hover {
  background-color: var(--color-background-soft);
  transform: translateY(-1px);
}

.toggle-icon {
  font-size: 1rem;
}
</style>
