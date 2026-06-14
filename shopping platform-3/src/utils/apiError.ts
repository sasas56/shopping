import type { AxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback = '请求失败'): string {
  const axiosError = error as AxiosError<{ message?: string }>
  const message = axiosError?.response?.data?.message
  if (message) return message
  if (error instanceof Error && error.message && !error.message.startsWith('Request failed')) {
    return error.message
  }
  return fallback
}

export function isAuthApiUrl(url?: string): boolean {
  if (!url) return false
  return /\/users\/(login|register)$/.test(url)
}
