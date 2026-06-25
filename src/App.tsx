import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import { registerNavigation } from '@/lib/navigation'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  // Keep the navigation bridge in sync so non-React modules (the Axios 401
  // interceptor) can redirect via React Router instead of window.location.
  useEffect(() => {
    registerNavigation(navigate, location)
  }, [navigate, location])

  return <AppRoutes />
}
