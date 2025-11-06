<script setup lang="ts">
defineProps<{
  cca3?: string
  name?: string
  flag?: string
  population?: number
  region?: string
  capital?: string
}>()
</script>

<template>
  <RouterLink
    class="country-card"
    :to="{ name: 'country-detail', params: { cca3 } }"
    v-slot="{ navigate }"
  >
    <div role="link" @click="navigate">
      <div class="flag-container">
        <img :src="flag" :alt="name ?? 'N/A'" />
      </div>
      <div class="country-name">{{ name ?? 'N/A' }}</div>
      <span class="country-name">population: {{ population ?? 'N/A' }}</span>
      <span class="country-name">region: {{ region ?? 'N/A' }}</span>
      <span class="country-name">capital: {{ capital ?? 'N/A' }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.country-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.flag-container {
  position: relative;
  width: 100%;
  max-width: 160px;
  aspect-ratio: 4/3;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag-container img {
  max-width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 4px;
}

.country-name {
  margin-top: 8px;
  font-weight: 500;
}
</style>
