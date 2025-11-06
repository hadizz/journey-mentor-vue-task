import type { Country } from '@/models/Country'
import { useCountriesFilterStore } from '@/stores/countriesFilter'
import { computed, type Ref } from 'vue'
import { useDebounce } from './useDebounce'

export function useSearch(
  searchTerm: Ref<string>,
  countries: Ref<Country[]>,
  region: Ref<string>,
  debounceMs: number = 300,
  isLoading?: Ref<boolean>,
) {
  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, debounceMs)
  const filterStore = useCountriesFilterStore()

  const filteredCountries = computed(() => {
    const loading = isLoading?.value === true

    if (loading) {
      return []
    }

    const allCountries = countries.value || []
    const searchQuery = debouncedSearchTerm.value?.trim() || ''
    const selectedRegion = region.value?.trim() || ''

    if (!searchQuery && !selectedRegion) {
      return allCountries
    }

    const cachedResults = filterStore.getCachedResult(searchQuery, selectedRegion)
    if (cachedResults !== null) {
      return cachedResults
    }

    // First filter by region if selected
    let regionFilteredCountries = allCountries
    if (selectedRegion) {
      regionFilteredCountries = allCountries.filter(
        (country) => country.region?.toLowerCase() === selectedRegion.toLowerCase(),
      )
    }

    // If no search term, return region-filtered results
    if (!searchQuery) {
      // Only cache when data is loaded and present
      filterStore.setCachedResult(searchQuery, selectedRegion, regionFilteredCountries)
      return regionFilteredCountries
    }

    // Filter by search term
    const searchQueryLower = searchQuery.toLowerCase()
    const filteredResults = regionFilteredCountries.filter((country) => {
      const nameMatch = country.name?.toLowerCase().includes(searchQueryLower)
      const capitalMatch = country.capital?.toLowerCase().includes(searchQueryLower)
      const regionMatch = country.region?.toLowerCase().includes(searchQueryLower)
      return nameMatch || capitalMatch || regionMatch
    })

    filterStore.setCachedResult(searchQuery, selectedRegion, filteredResults)

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
