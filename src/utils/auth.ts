const AUTH_TOKEN_KEY = 'omni_auth_token'
const PENDING_BASIC_INFO_KEY = 'omni_pending_basic_info'

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isLoggedIn() {
  return Boolean(getAuthToken())
}

export function setPendingBasicInfo() {
  localStorage.setItem(PENDING_BASIC_INFO_KEY, 'true')
}

export function clearPendingBasicInfo() {
  localStorage.removeItem(PENDING_BASIC_INFO_KEY)
}

export function hasPendingBasicInfo() {
  return localStorage.getItem(PENDING_BASIC_INFO_KEY) === 'true'
}
