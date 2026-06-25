const TOKEN_KEY = 'fastcart_token'

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore storage errors */
  }
}

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore storage errors */
  }
}
