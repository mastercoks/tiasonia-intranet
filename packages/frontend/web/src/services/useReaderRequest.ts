import { AxiosRequestConfig } from 'axios'

import useRequest, { Return } from './useRequest'

export default function useReaderRequest<Data = unknown, Error = unknown>(
  request: AxiosRequestConfig
): Return<Data, Error> {
  const { response, ...rest } = useRequest<Data, Error>({
    ...request
  })
  return { response, ...rest }
}
