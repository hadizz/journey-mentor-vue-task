import type { Country, GetAllCountriesParams } from '@/models/Country'
import { getAllCountriesServiceApi } from '@/services/countries'
import { useQuery, useQueryClient } from '@tanstack/vue-query'

const defaultParams: Partial<GetAllCountriesParams> = {
  fields: {
    name: true,
    flags: true,
    capital: true,
    population: true,
    region: true,
  },
}

export const COUNTRIES_QUERY_KEYS = {
  all: ['countries'] as const,
  lists: () => [...COUNTRIES_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...COUNTRIES_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...COUNTRIES_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...COUNTRIES_QUERY_KEYS.details(), name] as const,
}

export function useCountries(params: Partial<GetAllCountriesParams> = defaultParams) {
  return useQuery({
    queryKey: COUNTRIES_QUERY_KEYS.list(params),
    queryFn: () => getAllCountriesServiceApi(params),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useCountriesCache() {
  const queryClient = useQueryClient()

  const invalidateCountries = (params: Record<string, any> = {}) => {
    return queryClient.invalidateQueries({
      queryKey: COUNTRIES_QUERY_KEYS.list(params),
    })
  }

  const prefetchCountries = (params: Record<string, any> = {}) => {
    return queryClient.prefetchQuery({
      queryKey: COUNTRIES_QUERY_KEYS.list(params),
      queryFn: () => getAllCountriesServiceApi(params),
      staleTime: 5 * 60 * 1000,
    })
  }

  const setCountriesData = (data: Country[], params: Record<string, any> = {}) => {
    queryClient.setQueryData(COUNTRIES_QUERY_KEYS.list(params), data)
  }

  const getCountriesData = (params: Record<string, any> = {}) => {
    return queryClient.getQueryData<Country[]>(COUNTRIES_QUERY_KEYS.list(params))
  }

  return {
    invalidateCountries,
    prefetchCountries,
    setCountriesData,
    getCountriesData,
  }
}
