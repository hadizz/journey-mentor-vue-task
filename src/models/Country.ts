export interface Country {
  flags: {
    png: string
    svg: string
    alt: string
  }
  name: {
    common: string
    official: string
    nativeName: any
  }
  capital: string
  region: string
  population: number
}

type Fields = keyof Country

export interface GetAllCountriesParams {
  fields?: Partial<Record<Fields, boolean>>
}

export type GetAllCountriesResponse = Country[]
