import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth'
import { API_BASE } from '../utils/constants'
import { fetchWithAuth } from '../utils/api-client'

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok && res.status !== 401) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok && res.status !== 409) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getMe(): Promise<User> {
  const res = await fetchWithAuth(`${API_BASE}/api/auth/me`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** Login via aslan-iam and exchange the RS256 token for an arc-reactor HS256 token. */
export async function loginWithIam(email: string, password: string): Promise<AuthResponse> {
  // 1. Authenticate against aslan-iam
  const iamRes = await fetch(`${API_BASE}/iam-api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!iamRes.ok) {
    if (iamRes.status === 401) return { token: '', user: null, error: 'Invalid IAM credentials' }
    throw new Error(`IAM HTTP ${iamRes.status}`)
  }
  const iamData = await iamRes.json()
  const iamToken = iamData.accessToken ?? iamData.token
  if (!iamToken) return { token: '', user: null, error: 'IAM login failed' }

  // 2. Exchange IAM token for arc-reactor token
  const exchangeRes = await fetch(`${API_BASE}/api/auth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: iamToken }),
  })
  if (!exchangeRes.ok) {
    const data = await exchangeRes.json().catch(() => ({}))
    return { token: '', user: null, error: data.error ?? `Exchange failed (${exchangeRes.status})` }
  }
  return exchangeRes.json()
}

/**
 * Probe whether auth is enabled on the backend.
 * Calls /api/models without token — 401 means auth is required.
 */
export async function checkAuthRequired(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${API_BASE}/api/models`, { signal: controller.signal })
    clearTimeout(timeout)
    return res.status === 401
  } catch {
    return false
  }
}
