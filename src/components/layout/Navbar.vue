<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <h1 class="site-name">Where in the World</h1>
      </div>

      <button @click="toggleDarkMode" class="dark-mode-toggle">
        <span class="toggle-icon">🌙</span>
        Dark Mode
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'toggle-dark-mode': []
}>()

const toggleDarkMode = () => {
  emit('toggle-dark-mode')
}
</script>

<style scoped>
.navbar {
  background-color: var(--color-background);
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

.site-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text);
  margin: 0;
}

.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.dark-mode-toggle:hover {
  background-color: #f5f5f5;
}

.toggle-icon {
  font-size: 1rem;
}
</style>
