import { getCountryDetailByCca3ServiceApi } from '@/services/countries'
import type { CountryDetail } from '@/utils/country'
import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref, unref } from 'vue'

export const COUNTRY_DETAIL_QUERY_KEYS = {
  all: ['country-detail'] as const,
  detail: (cca3: string) => [...COUNTRY_DETAIL_QUERY_KEYS.all, cca3] as const,
}

export function useCountryDetail(cca3: Ref<string> | string) {
  const code = computed(() => unref(cca3))

  return useQuery<CountryDetail>({
    queryKey: computed(() => COUNTRY_DETAIL_QUERY_KEYS.detail(code.value)),
    queryFn: () => getCountryDetailByCca3ServiceApi(code.value),
    enabled: computed(() => !!code.value),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}
