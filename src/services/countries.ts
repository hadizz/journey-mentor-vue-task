import type { GetAllCountriesParams, GetAllCountriesResponse } from '@/models/Country'
import { formatFields } from '@/utils'
import axiosInstance from './axios'

export const getAllCountriesServiceApi = (params: Partial<GetAllCountriesParams>) => {
  const { fields, ...rest } = params
  return axiosInstance.get<GetAllCountriesResponse>('/all', {
    params: {
      fields: fields ? formatFields(fields) : undefined,
      ...rest,
    },
  })
}
