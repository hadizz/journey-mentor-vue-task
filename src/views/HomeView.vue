<script setup lang="ts">
import CountryCard from '@/components/CountryCard.vue'
import { useCountries } from '@/composables/useCountries'
import { useLoadMore } from '@/composables/useLoadMore'
import type { Country } from '@/models/Country'

const PAGE_SIZE = 10

const { data: countries, isLoading: loading, error, refetch } = useCountries()

const {
  visibleItems: visibleCountries,
  hasMore,
  loadMoreTrigger,
} = useLoadMore<Country>({
  items: countries,
  pageSize: PAGE_SIZE,
  isLoading: loading,
  error,
  rootMargin: '0px 0px 200px 0px',
})

const handleRetry = () => {
  refetch()
}
</script>

<template>
  <div class="container">
    <h1>Countries</h1>
    <div v-if="loading" class="loading">Loading countries...</div>
    <div v-else-if="error" class="error">
      <p>Error loading countries: {{ error.message }}</p>
      <button @click="handleRetry">Retry</button>
    </div>
    <ul v-else>
      <li v-for="country in visibleCountries" :key="country.name.common">
        <CountryCard
          :name="country.name.common"
          :flag="country.flags.png"
          :population="country.population"
          :region="country.region"
          :capital="country.capital[0]"
        />
      </li>
      <li v-if="hasMore" class="load-more-placeholder">
        <div ref="loadMoreTrigger" class="load-more-trigger" aria-hidden="true"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.container h1 {
  text-align: center;
  margin-bottom: 32px;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 40px 0;
}

.error {
  color: red;
  text-align: center;
  margin: 20px 0;
}

.error button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background-color: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
}

li {
  display: flex;
  justify-content: center;
}

.load-more-placeholder {
  display: flex;
  justify-content: center;
}

.load-more-trigger {
  width: 100%;
  height: 1px;
}

@media (max-width: 768px) {
  ul {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  ul {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 20px;
  }
}

@media (min-width: 1025px) {
  ul {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 24px;
  }
}
</style>
