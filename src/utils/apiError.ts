// Pulls a human-readable message out of an axiosBaseQuery error. The API returns
// `{ data, errors: string[], statusCode }`; on failure `errors` holds the reason
// (e.g. "User already exists"). Falls back to a string body or a generic message.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object' && 'errors' in data) {
      const errors = (data as { errors?: unknown }).errors
      if (Array.isArray(errors) && errors.length > 0) {
        return errors.filter((e) => typeof e === 'string').join(' ') || fallback
      }
    }
  }
  return fallback
}
