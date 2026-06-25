const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? ''

export function getImageUrl(path: string | null | undefined): string {
  if (!path || !path.trim()) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const norm = path.replace(/\\/g, '/')
  return `${API_BASE}${norm.startsWith('/') ? norm : `/${norm}`}`
}
