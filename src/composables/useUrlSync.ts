import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounce } from './useDebounce'

interface UrlSyncOptions {
  debounceMs?: number
  replaceHistory?: boolean
}

export function useUrlSync(query: Ref<string>, region: Ref<string>, options: UrlSyncOptions = {}) {
  const { debounceMs = 300, replaceHistory = false } = options
  const router = useRouter()
  const route = useRoute()

  // Create debounced versions of the reactive values
  const { debouncedValue: debouncedQuery } = useDebounce(query, debounceMs)
  const { debouncedValue: debouncedRegion } = useDebounce(region, debounceMs)

  const isInitialized = ref(false)

  // Initialize filters from URL on mount
  const initializeFromUrl = () => {
    const urlQuery = (route.query.query as string) || ''
    const urlRegion = (route.query.region as string) || ''

    query.value = urlQuery
    region.value = urlRegion
    isInitialized.value = true
  }

  // Update URL when filters change (debounced)
  const updateUrl = (newQuery: string, newRegion: string) => {
    if (!isInitialized.value) return

    const queryParams: Record<string, string> = {}

    if (newQuery.trim()) {
      queryParams.query = newQuery.trim()
    }

    if (newRegion.trim()) {
      queryParams.region = newRegion.trim()
    }

    // Only update URL if there's actually a change
    const currentQuery = (route.query.query as string) || ''
    const currentRegion = (route.query.region as string) || ''

    if (
      currentQuery === (queryParams.query || '') &&
      currentRegion === (queryParams.region || '')
    ) {
      return
    }

    const method = replaceHistory ? 'replace' : 'push'
    router[method]({
      query: Object.keys(queryParams).length > 0 ? queryParams : {},
    })
  }

  // Watch for changes in debounced values and update URL
  watch([debouncedQuery, debouncedRegion], ([newQuery, newRegion]) => {
    updateUrl(newQuery, newRegion)
  })

  // Watch for route changes (browser back/forward navigation)
  watch(
    () => route.query,
    (newQuery) => {
      if (!isInitialized.value) return

      const urlQuery = (newQuery.query as string) || ''
      const urlRegion = (newQuery.region as string) || ''

      // Only update if the URL values are different from current values
      if (query.value !== urlQuery || region.value !== urlRegion) {
        query.value = urlQuery
        region.value = urlRegion
      }
    },
    { deep: true },
  )

  return {
    initializeFromUrl,
    isInitialized,
  }
}
