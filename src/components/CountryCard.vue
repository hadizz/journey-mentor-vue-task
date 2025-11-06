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
      <div class="country-info">
        <h3 class="country-name">{{ name ?? 'N/A' }}</h3>
        <div class="country-details">
          <p>
            <strong>Population:</strong> {{ population?.toLocaleString?.() ?? population ?? 'N/A' }}
          </p>
          <p><strong>Region:</strong> {{ region ?? 'N/A' }}</p>
          <p><strong>Capital:</strong> {{ capital ?? 'N/A' }}</p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.country-card {
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
  max-width: 264px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s ease;
}

.country-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--color-shadow);
}

.country-card > div {
  cursor: pointer;
}

.flag-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: var(--color-background-mute);
}

.flag-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.country-info {
  padding: 24px;
}

.country-name {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-heading);
}

.country-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.country-details p {
  margin: 0;
  font-weight: 300;
  color: var(--color-text);
}

.country-details strong {
  font-weight: 600;
}
</style>
