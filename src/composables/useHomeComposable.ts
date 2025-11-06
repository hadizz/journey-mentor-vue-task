import type { Country } from '@/models/Country'
import { computed, ref } from 'vue'
import { useCountries } from './useCountries'
import { useLoadMore } from './useLoadMore'
import { useSearch } from './useSearch'

export function useHomeComposable(pageSize: number = 10) {
  // Countries data
  const { data: countries, isLoading, error, refetch } = useCountries()

  // Ensure countries is always an array
  const safeCountries = computed(() => countries.value || [])

  // Search functionality
  const searchTerm = ref('')
  const { filteredCountries, isSearching } = useSearch(searchTerm, safeCountries)

  // Load more functionality
  const {
    visibleItems: visibleCountries,
    hasMore,
    loadMoreTrigger,
  } = useLoadMore<Country>({
    items: filteredCountries,
    pageSize,
    isLoading,
    error,
    rootMargin: '0px 0px 200px 0px',
  })

  // Actions
  const handleRetry = () => {
    refetch()
  }

  return {
    // Search
    searchTerm,
    isSearching,

    // Countries data
    countries: filteredCountries,
    visibleCountries,

    // Loading states
    loading: isLoading,
    error,

    // Load more
    hasMore,
    loadMoreTrigger,

    // Actions
    handleRetry,
  }
}
