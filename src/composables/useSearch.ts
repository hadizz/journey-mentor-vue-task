import type { Country } from '@/models/Country'
import { computed, type Ref } from 'vue'
import { useDebounce } from './useDebounce'

export function useSearch(
  searchTerm: Ref<string>,
  countries: Ref<Country[]>,
  debounceMs: number = 300,
) {
  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, debounceMs)

  // Filter countries based on the debounced search term
  const filteredCountries = computed(() => {
    const allCountries = countries.value || []

    if (!debouncedSearchTerm.value?.trim()) {
      return allCountries
    }

    const searchLower = debouncedSearchTerm.value.trim().toLowerCase()

    return allCountries.filter((country) => {
      const nameMatch = country.name.toLowerCase().includes(searchLower)
      const capitalMatch = country.capital?.toLowerCase().includes(searchLower)
      const regionMatch = country.region?.toLowerCase().includes(searchLower)
      return nameMatch || capitalMatch || regionMatch
    })
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
