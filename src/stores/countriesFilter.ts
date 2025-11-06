import type { Country } from '@/models/Country'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface FilterCache {
  results: Country[]
  timestamp: number
}

interface FilterState {
  query: string
  region: string
}

export const useCountriesFilterStore = defineStore('countriesFilter', () => {
  const cache = ref<Map<string, FilterCache>>(new Map())
  const filters = ref<FilterState>({
    query: '',
    region: '',
  })

  const createCacheKey = (query: string, region: string): string => {
    const normalizedQuery = query.trim() || 'N/A'
    const normalizedRegion = region.trim() || 'N/A'
    return `${normalizedQuery}:${normalizedRegion}`
  }

  const getCachedResult = (query: string, region: string): Country[] | null => {
    const cacheKey = createCacheKey(query, region)
    const cached = cache.value.get(cacheKey)

    if (!cached) {
      return null
    }

    // Optional: Add cache expiration (e.g., 5 minutes)
    const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000
    if (isExpired) {
      cache.value.delete(cacheKey)
      return null
    }

    return cached.results
  }

  const setCachedResult = (query: string, region: string, results: Country[]): void => {
    const cacheKey = createCacheKey(query, region)
    cache.value.set(cacheKey, {
      results: [...results],
      timestamp: Date.now(),
    })
  }

  const setFilters = (newFilters: Partial<FilterState>): void => {
    if (newFilters.query !== undefined) {
      filters.value.query = newFilters.query
    }
    if (newFilters.region !== undefined) {
      filters.value.region = newFilters.region
    }
  }

  const clearCache = (): void => {
    cache.value.clear()
  }

  return {
    filters,
    getCachedResult,
    setCachedResult,
    setFilters,
    clearCache,
    createCacheKey,
  }
})
