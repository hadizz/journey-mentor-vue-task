<script setup lang="ts">
import CountryCard from '@/components/CountryCard.vue'
import Select from '@/components/ui/Select.vue'
import TextField from '@/components/ui/TextField.vue'
import { useHomeComposable } from '@/composables/useHomeComposable'
import { REGIONS } from '@/constants/country'

const PAGE_SIZE = 10

const {
  searchTerm,
  region,
  isSearching,
  countries,
  visibleCountries,
  loading,
  error,
  hasMore,
  loadMoreTrigger,
  handleRetry,
} = useHomeComposable(PAGE_SIZE)
</script>

<template>
  <div class="container">
    <div class="filters-container">
      <TextField placeholder="Search for a country..." v-model="searchTerm" class="search-field" />
      <Select
        placeholder="Select a region"
        v-model="region"
        class="select-field"
        :options="REGIONS"
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
      <li v-for="country in visibleCountries" :key="country.cca3">
        <CountryCard
          :cca3="country.cca3"
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
  color: var(--color-text);
}

.filters-container {
  display: flex;
  gap: 24px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.search-field {
  flex: 1;
  max-width: 480px;
}

.select-field {
  max-width: 200px;
}

.loading {
  text-align: center;
  color: var(--color-text-secondary);
  margin: 40px 0;
  font-weight: 300;
}

.error {
  color: var(--color-text);
  text-align: center;
  margin: 40px 0;
}

.error button {
  margin-top: 16px;
  padding: 10px 20px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 300;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s ease;
}

.error button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.no-results {
  text-align: center;
  color: var(--color-text-secondary);
  margin: 40px 0;
  font-weight: 300;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(264px, 1fr));
  gap: 75px;
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
  .filters-container {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  .search-field {
    max-width: 100%;
  }

  ul {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  ul {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 60px;
  }
}

@media (min-width: 1025px) {
  ul {
    grid-template-columns: repeat(auto-fill, minmax(264px, 1fr));
    gap: 75px;
  }
}
</style>
