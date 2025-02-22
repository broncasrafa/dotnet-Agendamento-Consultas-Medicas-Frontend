export interface ApiPagedResponse<T> {
  data?: ApiPagedData<T>
}

export interface ApiPagedData<T> {
  results: T[]
  total: number
  hasNextPage: boolean
  endPage: number
}
