import type { Location, NavigateFunction } from 'react-router-dom'
import { loginWithRedirect } from '@/utils/redirect'

// Bridges React Router's navigate into non-React modules (e.g. the Axios
// response interceptor, which cannot call the useNavigate hook). App.tsx
// re-registers on every location change so these references stay current.
let navigate: NavigateFunction | null = null
let location: Location | null = null

export const registerNavigation = (
  nav: NavigateFunction,
  loc: Location,
): void => {
  navigate = nav
  location = loc
}

/**
 * Redirect to /login (preserving the current location) after a 401/logout.
 * Uses React Router navigation instead of window.location so the SPA does a
 * client-side transition without a full page reload. No-ops while already on
 * /login to avoid a redirect loop.
 */
export const navigateToLogin = (): void => {
  const from = location ? location.pathname + location.search : '/'
  if (from.startsWith('/login')) return
  navigate?.(loginWithRedirect(from), { replace: true })
}
