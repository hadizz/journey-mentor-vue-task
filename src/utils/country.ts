import type { Country } from '@/models/Country'

export const formatCountry = (country: any): Country => {
  return {
    ...country,
    name: country.name.common,
    capital: country.capital[0],
    region: country.region,
    population: country.population,
    flag: country.flags.png,
  }
}
