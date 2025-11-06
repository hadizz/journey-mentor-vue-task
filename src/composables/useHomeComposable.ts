import type { Country } from '@/models/Country'
import { computed, ref } from 'vue'
import { useCountries } from './useCountries'
import { useLoadMore } from './useLoadMore'
import { useSearch } from './useSearch'

export function useHomeComposable(pageSize: number = 10) {
  const { data: countries, isLoading, error, refetch } = useCountries()

  const safeCountries = computed(() => countries.value || [])

  const searchTerm = ref('')
  const { filteredCountries, isSearching } = useSearch(searchTerm, safeCountries)

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

  // Actions
  const handleRetry = () => {
    refetch()
  }

  return {
    searchTerm,
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
