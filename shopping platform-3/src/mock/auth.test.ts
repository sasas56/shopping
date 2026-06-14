import { describe, it, expect, beforeEach } from 'vitest'
import { mockLogin, mockRegister, mockGetUserInfo, mockUpdateUserInfo } from './data'

describe('mock auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('logs in with default admin account', async () => {
    const result = await mockLogin({ username: 'admin', password: '123456' })
    expect(result.success).toBe(true)
    expect(result.data.token).toContain('mock.')
    expect(result.data.user.username).toBe('admin')
  })

  it('rejects invalid credentials', async () => {
    const result = await mockLogin({ username: 'admin', password: 'wrong' })
    expect(result.success).toBe(false)
    expect(result.code).toBe(401)
  })

  it('registers and logs in new user', async () => {
    await mockRegister({
      username: 'testuser',
      password: '123456',
      email: 'test@example.com',
      phone: '13900139000'
    })

    const login = await mockLogin({ username: 'testuser', password: '123456' })
    expect(login.success).toBe(true)
    expect(login.data.user.email).toBe('test@example.com')
  })

  it('returns current user info with mock token', async () => {
    const login = await mockLogin({ username: 'admin', password: '123456' })
    localStorage.setItem('token', login.data.token)
    localStorage.setItem('user', JSON.stringify(login.data.user))

    const info = await mockGetUserInfo()
    expect(info.success).toBe(true)
    expect(info.data.username).toBe('admin')
    expect(info.data.email).toBe('admin@example.com')
  })

  it('updates user profile in mock mode', async () => {
    const login = await mockLogin({ username: 'admin', password: '123456' })
    localStorage.setItem('token', login.data.token)
    localStorage.setItem('user', JSON.stringify(login.data.user))

    const updated = await mockUpdateUserInfo({ phone: '13900001111' })
    expect(updated.success).toBe(true)
    expect(updated.data.phone).toBe('13900001111')

    const info = await mockGetUserInfo()
    expect(info.data.phone).toBe('13900001111')
  })
})
