import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { loginWithRedirect } from '@/utils/redirect'

/**
 * Guards cart, checkout, and profile routes (TZ §10). Unauthenticated users
 * are redirected to /login with the attempted location preserved so login can
 * send them back. Token survives reload via the auth slice rehydration.
 */
export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)
  const location = useLocation()

  if (!token) {
    const to = loginWithRedirect(location.pathname + location.search)
    return <Navigate to={to} replace />
  }

  return <Outlet />
}
