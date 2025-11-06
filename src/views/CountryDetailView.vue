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
}

.back-btn {
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.flag-wrap {
  width: 100%;
  aspect-ratio: 4/3;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.flag-wrap img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.info .title {
  margin-top: 0;
  margin-bottom: 16px;
}

.meta {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 8px;
  padding: 0;
  list-style: none;
}

.borders {
  margin-top: 16px;
}

.border-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
}

.border-pill-link {
  text-decoration: none;
  color: inherit;
}

.border-pill {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
}

.border-empty {
  margin-left: 8px;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
  }
}
</style>
