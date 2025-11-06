import type { Country } from '@/models/Country'

export const formatCountry = (country: any): Country => {
  return {
    cca3: country.cca3,
    ...country,
    name: country.name.common,
    capital: country.capital[0],
    region: country.region,
    population: country.population,
    flag: country.flags.png,
  }
}

export interface CountryDetail {
  cca3: string
  flag: string
  name: string
  nativeName: string
  population: number
  region: string
  subregion: string
  capital: string
  tld: string[]
  currencies: string[]
  languages: string[]
  borders: string[]
}

export const formatCountryDetail = (country: any): CountryDetail => {
  const nativeName = country?.name?.nativeName
    ? (Object.values(country.name.nativeName)[0] as any)?.common ||
      (Object.values(country.name.nativeName)[0] as any)?.official ||
      country.name.common
    : country?.name?.common

  const currencies = country?.currencies
    ? Object.values(country.currencies).map((c: any) => c?.name || '')
    : []

  const languages = country?.languages ? Object.values(country.languages) : []

  const capital = Array.isArray(country?.capital) ? country.capital[0] : country?.capital

  return {
    cca3: country.cca3,
    flag: country?.flags?.png || country?.flags?.svg || '',
    name: country?.name?.common || '',
    nativeName: nativeName || '',
    population: country?.population || 0,
    region: country?.region || '',
    subregion: country?.subregion || '',
    capital: capital || '',
    tld: country?.tld || [],
    currencies,
    languages: languages as string[],
    borders: Array.isArray(country?.borders) ? (country.borders as string[]) : [],
  }
}
