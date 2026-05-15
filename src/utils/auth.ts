const AUTH_TOKEN_KEY = 'omni_auth_token'

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthToken(token: string) {
  if (!token) return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isLoggedIn() {
  return Boolean(getAuthToken())
}
