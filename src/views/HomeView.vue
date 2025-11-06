<script setup lang="ts">
import CountryCard from '@/components/CountryCard.vue'
import type { Country } from '@/models/Country'
import { ref } from 'vue'

const countries = ref<Country[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

const reloadPage = () => {
  window.location.reload()
}

fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
  .then((data) => {
    countries.value = data
    loading.value = false
  })
  .catch((err) => {
    console.error('Error:', err)
    error.value = err.message || 'Failed to fetch countries'
    loading.value = false
  })
</script>

<template>
  <div class="container">
    <h1>Countries</h1>
    <div v-if="loading" class="loading">Loading countries...</div>
    <div v-else-if="error" class="error">
      <p>Error loading countries: {{ error }}</p>
      <button @click="reloadPage">Retry</button>
    </div>
    <ul v-else>
      <li v-for="country in countries" :key="country.name.common">
        <CountryCard
          :name="country.name.common"
          :flag="country.flags.png"
          :population="country.population"
          :region="country.region"
          :capital="country.capital[0]"
        />
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
