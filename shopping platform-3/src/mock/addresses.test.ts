import { describe, it, expect, beforeEach } from 'vitest'
import {
  mockFetchAddresses,
  mockAddAddress,
  mockUpdateAddress,
  mockDeleteAddress
} from './data'

describe('mock addresses persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and reloads addresses from localStorage', async () => {
    await mockAddAddress({
      receiver: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园路1号',
      isDefault: true
    })

    const list = await mockFetchAddresses()
    expect(list.success).toBe(true)
    expect(list.data).toHaveLength(1)
    expect(list.data[0].receiver).toBe('张三')
    expect(list.data[0].isDefault).toBe(true)
  })

  it('updates and deletes address', async () => {
    const created = await mockAddAddress({
      receiver: '李四',
      phone: '13900139000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路88号',
      isDefault: false
    })
    const id = created.data.id

    await mockUpdateAddress(id, { receiver: '李四（更新）', isDefault: true })
    const list = await mockFetchAddresses()
    expect(list.data[0].receiver).toBe('李四（更新）')
    expect(list.data[0].isDefault).toBe(true)

    await mockDeleteAddress(id)
    const empty = await mockFetchAddresses()
    expect(empty.data).toHaveLength(0)
  })
})
