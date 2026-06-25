// Response envelopes used by every store-api.softclub.tj endpoint.
// Simple endpoints wrap the payload in `data` alongside `errors` + `statusCode`;
// list endpoints add pagination metadata. Field names mirror the API exactly.

export interface ApiResponse<T> {
  data: T
  errors: string[]
  statusCode: number
}

export interface PaginatedResponse<T> {
  pageNumber: number
  pageSize: number
  totalPage: number
  totalRecord: number
  data: T
  errors: string[]
  statusCode: number
}
