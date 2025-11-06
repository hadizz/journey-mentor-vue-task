import type { Country } from '@/models/Country'
import { useCountriesFilterStore } from '@/stores/countriesFilter'
import { computed, onMounted, ref } from 'vue'
import { useCountries } from './useCountries'
import { useLoadMore } from './useLoadMore'
import { useSearch } from './useSearch'
import { useUrlSync } from './useUrlSync'

export function useHomeComposable(pageSize: number = 10) {
  const { data: countries, isLoading, error, refetch } = useCountries()
  const filterStore = useCountriesFilterStore()

  const safeCountries = computed(() => countries.value || [])

  const searchTerm = ref('')
  const region = ref('')

  // Set up URL synchronization
  const { initializeFromUrl } = useUrlSync(searchTerm, region, {
    debounceMs: 300,
    replaceHistory: false, // Create new history entries
  })

  const { filteredCountries, isSearching } = useSearch(searchTerm, safeCountries, region)

  const {
    visibleItems: visibleCountries,
    hasMore,
    loadMoreTrigger,
  } = useLoadMore<Country>({
    items: computed(() => filteredCountries.value.filter(Boolean) as Country[]),
    pageSize,
    isLoading,
    error,
    rootMargin: '0px 0px 200px 0px',
  })

  // Initialize from URL on mount
  onMounted(() => {
    initializeFromUrl()
  })

  // Actions
  const handleRetry = () => {
    refetch()
  }

  return {
    searchTerm,
    region,
    isSearching,
    countries: filteredCountries,
    visibleCountries,
    loading: isLoading,
    error,
    hasMore,
    loadMoreTrigger,
    handleRetry,
  }
}
