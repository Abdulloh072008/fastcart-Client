function decodePayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null
  try {
    const raw = token.split('.')[1]
    return JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>
  } catch {
    return null
  }
}

// Decode the JWT payload (no signature verification — client-side only).
// Used to extract the user's display name for the account avatar initial.
export function getUserInitial(token: string | null): string {
  const payload = decodePayload(token)
  if (!payload) return 'U'
  const name =
    (payload['name'] as string | undefined) ??
    (payload['unique_name'] as string | undefined) ??
    (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string | undefined) ??
    (payload['sub'] as string | undefined) ??
    ''
  return name.charAt(0).toUpperCase() || 'U'
}

// Extract the userId from the JWT. Tries every common .NET Identity claim name,
// then falls back to any GUID-shaped string value in the payload.
export function getUserId(token: string | null): string {
  const payload = decodePayload(token)
  if (!payload) return ''

  const fromClaim = (
    (payload['nameid'] as string | undefined) ??
    (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] as string | undefined) ??
    (payload['sub'] as string | undefined) ??
    (payload['uid'] as string | undefined) ??
    (payload['userId'] as string | undefined) ??
    (payload['user_id'] as string | undefined) ??
    (payload['id'] as string | undefined) ??
    (payload['oid'] as string | undefined) ??
    ''
  )
  if (fromClaim) return fromClaim

  // Last resort: the first GUID-shaped string value in the payload is almost certainly the user id.
  const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  for (const value of Object.values(payload)) {
    if (typeof value === 'string' && guidPattern.test(value)) return value
  }

  return ''
}
