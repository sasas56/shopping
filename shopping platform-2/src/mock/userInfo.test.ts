import { describe, it, expect, beforeEach } from 'vitest'
import { findMockHandler } from './handler'
import { mockGetUserInfo, mockAddAddress } from './data'

describe('mock user info does not break address flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('registers mock handler for GET /users/me', () => {
    expect(findMockHandler('GET', '/users/me')).toBeDefined()
  })

  it('allows fetchUserInfo and addAddress in same session', async () => {
    localStorage.setItem(
      'token',
      'mock.' + btoa(JSON.stringify({ userId: 1, username: 'admin', mock: true })) + '.token'
    )
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        phone: '13800138000',
        createdAt: '2024-01-01T00:00:00.000Z'
      })
    )

    const info = await mockGetUserInfo()
    expect(info.success).toBe(true)

    const address = await mockAddAddress({
      receiver: '测试用户',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园路1号',
      isDefault: true
    })
    expect(address.success).toBe(true)
    expect(address.data.receiver).toBe('测试用户')
  })
})
