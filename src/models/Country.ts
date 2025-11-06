export interface Country {
  cca3: string
  flag: string
  name: string
  capital: string
  region: string
  population: number
}

type Fields = keyof Country

export interface GetAllCountriesParams {
  fields?: Partial<Record<Fields, boolean>>
}

export type GetAllCountriesResponse = Country[]
