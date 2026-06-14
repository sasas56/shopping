import { describe, it, expect } from 'vitest'
import { getApiErrorMessage, isAuthApiUrl } from './apiError'

describe('apiError', () => {
  it('detects auth endpoints', () => {
    expect(isAuthApiUrl('/users/login')).toBe(true)
    expect(isAuthApiUrl('/users/register')).toBe(true)
    expect(isAuthApiUrl('/users/me')).toBe(false)
  })

  it('extracts message from Error', () => {
    expect(getApiErrorMessage(new Error('用户名或密码错误'), 'fallback')).toBe('用户名或密码错误')
  })

  it('uses fallback for unknown errors', () => {
    expect(getApiErrorMessage({}, '登录失败')).toBe('登录失败')
  })
})
