import { useCountriesCache } from './useCountries'

const nameCache = new Map<string, string>()

export function useCountryNameLookup() {
  const { getCountriesData } = useCountriesCache()

  const getNameByCca3 = (cca3?: string | null): string | undefined => {
    console.log('cca3', cca3)

    if (!cca3) return undefined
    const key = String(cca3).trim().toUpperCase()
    const hit = nameCache.get(key)
    if (hit) return hit

    const countries = getCountriesData()
    console.log('countries', countries)

    const match = countries?.find((c) => String(c.cca3).toUpperCase() === key)
    const name = match?.name
    if (name) {
      nameCache.set(key, name)
    }
    return name
  }

  return { getNameByCca3 }
}
