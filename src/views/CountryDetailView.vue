<script setup lang="ts">
import { useCountryDetail } from '@/composables/useCountryDetail'
import { useCountryNameLookup } from '@/composables/useCountryNameLookup'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const cca3 = computed(() => String(route.params.cca3 || ''))
const { data, isLoading, error, refetch } = useCountryDetail(cca3)

const handleBack = () => {
  router.push({ name: 'home' })
}

const { getNameByCca3 } = useCountryNameLookup()

const borders = computed(() => {
  const borders = data.value?.borders || []
  return borders.map((cca3) => ({ cca3, name: getNameByCca3(cca3) }))
})
</script>

<template>
  <div class="detail-container">
    <button class="back-btn" @click="handleBack">Back</button>

    <div v-if="isLoading" class="loading">Loading country...</div>
    <div v-else-if="error" class="error">
      <p>Error loading country: {{ error?.message }}</p>
      <button @click="() => refetch()">Retry</button>
    </div>
    <div v-else-if="!data" class="empty">No country found.</div>
    <div v-else class="detail-content">
      <div class="flag-wrap">
        <img :src="data.flag" :alt="data.name" />
      </div>
      <div class="info">
        <h2 class="title">{{ data.name }}</h2>
        <ul class="meta">
          <li><strong>Native Name:</strong> {{ data.nativeName || 'N/A' }}</li>
          <li>
            <strong>Population:</strong>
            {{ data.population?.toLocaleString?.() || data.population }}
          </li>
          <li><strong>Region:</strong> {{ data.region || 'N/A' }}</li>
          <li><strong>Sub Region:</strong> {{ data.subregion || 'N/A' }}</li>
          <li><strong>Capital:</strong> {{ data.capital || 'N/A' }}</li>
          <li><strong>Top Level Domain:</strong> {{ (data.tld || []).join(', ') || 'N/A' }}</li>
          <li><strong>Currencies:</strong> {{ (data.currencies || []).join(', ') || 'N/A' }}</li>
          <li><strong>Languages:</strong> {{ (data.languages || []).join(', ') || 'N/A' }}</li>
        </ul>
        <div class="borders">
          <strong>Border Countries:</strong>
          <span v-if="!borders.length" class="border-empty">None</span>
          <ul v-else class="border-list">
            <RouterLink
              v-for="border in borders"
              :key="border.cca3"
              class="border-pill-link"
              :to="{ name: 'country-detail', params: { cca3: border.cca3 } }"
            >
              <li class="border-pill">
                {{ border.name }}
              </li>
            </RouterLink>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 0px;
  font-size: 16px;
  color: var(--color-text);
}

.back-btn {
  margin-bottom: 32px;
  padding: 10px 24px;
  background-color: var(--color-background-soft);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text);
  font-weight: 300;
  font-size: 16px;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.flag-wrap {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--color-shadow);
}

.flag-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info .title {
  margin-top: 0;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-heading);
}

.meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 12px;
  padding: 0;
  list-style: none;
  margin-bottom: 40px;
}

.meta li {
  font-size: 16px;
  font-weight: 300;
}

.meta strong {
  font-weight: 600;
}

.borders {
  margin-top: 32px;
}

.borders > strong {
  font-weight: 600;
  font-size: 16px;
}

.border-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
}

.border-pill-link {
  text-decoration: none;
  color: inherit;
}

.border-pill {
  padding: 8px 16px;
  background-color: var(--color-background-soft);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 300;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s ease;
}

.border-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.border-empty {
  margin-left: 8px;
  font-weight: 300;
}

.loading,
.error,
.empty {
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  padding: 40px;
}

.error button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: var(--color-background-soft);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text);
  font-weight: 300;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .meta {
    grid-template-columns: 1fr;
    column-gap: 0;
  }

  .info .title {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }
}
</style>
