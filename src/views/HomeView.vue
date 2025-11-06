<script setup lang="ts">
import CountryCard from '@/components/CountryCard.vue'
import Select from '@/components/ui/Select.vue'
import TextField from '@/components/ui/TextField.vue'
import { useHomeComposable } from '@/composables/useHomeComposable'
import { ref } from 'vue'

const PAGE_SIZE = 10

const {
  searchTerm,
  isSearching,
  countries,
  visibleCountries,
  loading,
  error,
  hasMore,
  loadMoreTrigger,
  handleRetry,
} = useHomeComposable(PAGE_SIZE)

const region = ref('')
const regions = ref([
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
])
</script>

<template>
  <div class="container">
    <div class="filters-container">
      <TextField placeholder="Search for a country..." v-model="searchTerm" class="search-field" />
      <Select
        placeholder="Select a region"
        v-model="region"
        class="select-field"
        :options="regions"
      />
    </div>
    <div v-if="loading" class="loading">Loading countries...</div>
    <div v-else-if="error" class="error">
      <p>Error loading countries: {{ error.message }}</p>
      <button @click="handleRetry">Retry</button>
    </div>
    <div v-else-if="isSearching" class="loading">Searching...</div>
    <div v-else-if="searchTerm && countries.length === 0" class="no-results">
      <p>No countries found matching "{{ searchTerm }}"</p>
    </div>
    <ul v-else>
      <li v-for="country in visibleCountries" :key="country.name">
        <CountryCard
          :name="country.name"
          :flag="country.flag"
          :population="country.population"
          :region="country.region"
          :capital="country.capital"
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
  padding: 0px;
}

.filters-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-field {
  max-width: 400px;
}

.select-field {
  max-width: 200px;
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

.no-results {
  text-align: center;
  color: #666;
  margin: 40px 0;
  font-size: 1.1rem;
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
