import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

import { api } from './axios'

export type GetRequest = AxiosRequestConfig

export interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'mutate' | 'error'
  > {
  data: Data | undefined
  response: AxiosResponse<Data> | undefined
  requestKey: string
}
export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
  > {
  fallbackData?: Data
}

export function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
  const requestKey = request && JSON.stringify(request)

  const { data: response, error, isValidating, mutate } = useSWR(
    requestKey,
    () => api(request),
    {
      ...config,
      fallbackData: fallbackData && {
        status: 200,
        statusText: 'FallbackData',
        config: request,
        headers: {},
        data: fallbackData
      }
    }
  )

  return {
    data: response?.data,
    requestKey,
    response,
    error,
    isValidating,
    mutate
  }
}
