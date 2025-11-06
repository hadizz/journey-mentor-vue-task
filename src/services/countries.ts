import type { GetAllCountriesParams, GetAllCountriesResponse } from '@/models/Country'
import { formatFields } from '@/utils'
import { formatCountry } from '@/utils/country'
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
