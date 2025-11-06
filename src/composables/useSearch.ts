import type { Country } from '@/models/Country'
import { useSearchCacheStore } from '@/stores/searchCache'
import { computed, type Ref } from 'vue'
import { useDebounce } from './useDebounce'

export function useSearch(
  searchTerm: Ref<string>,
  countries: Ref<Country[]>,
  debounceMs: number = 300,
) {
  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, debounceMs)
  const searchCache = useSearchCacheStore()

  const filteredCountries = computed(() => {
    const allCountries = countries.value || []

    if (!debouncedSearchTerm.value?.trim()) {
      return allCountries
    }

    const searchQuery = debouncedSearchTerm.value.trim().toLowerCase()

    const cachedIndices = searchCache.getCachedResult(searchQuery)
    if (cachedIndices !== null) {
      return cachedIndices.map((index) => allCountries[index]).filter(Boolean)
    }

    const matchingIndices: number[] = []
    const filteredResults = allCountries.filter((country, index) => {
      const nameMatch = country.name?.toLowerCase().includes(searchQuery)
      const capitalMatch = country.capital?.toLowerCase().includes(searchQuery)
      const regionMatch = country.region?.toLowerCase().includes(searchQuery)
      const isMatch = nameMatch || capitalMatch || regionMatch

      if (isMatch) {
        matchingIndices.push(index)
      }

      return isMatch
    })

    searchCache.setCachedResult(searchQuery, matchingIndices)

    return filteredResults
  })

  const isSearching = computed(() => {
    return searchTerm.value !== debouncedSearchTerm.value
  })

  return {
    filteredCountries,
    debouncedSearchTerm,
    isSearching,
  }
}
