import type { GetAllCountriesParams, GetAllCountriesResponse } from '@/models/Country'
import { formatFields } from '@/utils'
import { formatCountry, formatCountryDetail, type CountryDetail } from '@/utils/country'
import axiosInstance from './axios'

export const getAllCountriesServiceApi = (params: Partial<GetAllCountriesParams>) => {
  const { fields, ...rest } = params
  return axiosInstance
    .get<GetAllCountriesResponse>('/all', {
      params: {
        fields: fields ? formatFields(fields) : undefined,
        ...rest,
      },
    })
    .then((res) => res.data.map((country) => formatCountry(country)))
}

export const getCountryDetailByCca3ServiceApi = (cca3: string) => {
  return axiosInstance
    .get<any[]>(`/alpha/${cca3}`)
    .then((res) => (Array.isArray(res.data) ? res.data[0] : res.data))
    .then((country) => formatCountryDetail(country) as CountryDetail)
}
