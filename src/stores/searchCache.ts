import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchCacheStore = defineStore('searchCache', () => {
  const cache = ref<Map<string, number[]>>(new Map())

  const getCachedResult = (query: string): number[] | null => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return null
    }

    const indices = cache.value.get(normalizedQuery)

    if (!indices) {
      return null
    }

    return indices
  }

  const setCachedResult = (query: string, indices: number[]): void => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return
    }

    cache.value.set(normalizedQuery, [...indices])
  }

  return {
    getCachedResult,
    setCachedResult,
  }
})
