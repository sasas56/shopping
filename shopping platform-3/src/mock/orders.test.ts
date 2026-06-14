import { describe, it, expect, beforeEach } from 'vitest'
import {
  mockCreateOrder,
  mockFetchOrders,
  mockFetchOrder,
  mockCancelOrder,
  mockPayOrder,
  mockCompleteOrder,
  mockAddToCart,
  mockAddAddress,
  mockClearCart
} from './data'

describe('mock order APIs', () => {
  beforeEach(async () => {
    localStorage.clear()
    await mockClearCart()
  })

  async function seedCartAndAddress() {
    await mockAddToCart({ productId: 1, quantity: 1 })
    const addressRes = await mockAddAddress({
      receiver: '测试用户',
      phone: '13800138000',
      province: '广东',
      city: '深圳',
      district: '南山',
      detail: '测试地址',
      isDefault: true
    })
    return addressRes.data.id
  }

  it('creates order from cart', async () => {
    const addressId = await seedCartAndAddress()
    const result = await mockCreateOrder({ addressId })

    expect(result.success).toBe(true)
    expect(result.data.id).toBeGreaterThan(0)
    expect(result.data.status).toBe('pending')
    expect(result.data.items).toHaveLength(1)
    expect(result.data.totalAmount).toBeGreaterThan(0)
  })

  it('rejects order when cart is empty', async () => {
    const addressRes = await mockAddAddress({
      receiver: '测试用户',
      phone: '13800138000',
      province: '广东',
      city: '深圳',
      district: '南山',
      detail: '测试地址',
      isDefault: true
    })

    const result = await mockCreateOrder({ addressId: addressRes.data.id })

    expect(result.success).toBe(false)
    expect(result.message).toContain('购物车为空')
  })

  it('lists and fetches order detail', async () => {
    const addressId = await seedCartAndAddress()
    const created = await mockCreateOrder({ addressId })

    const list = await mockFetchOrders({ page: 1, size: 10 })
    const detail = await mockFetchOrder(created.data.id)

    expect(list.success).toBe(true)
    expect(list.data.items).toHaveLength(1)
    expect(detail.success).toBe(true)
    expect(detail.data.id).toBe(created.data.id)
    expect(detail.data.address?.receiver).toBe('测试用户')
  })

  it('cancels pending order', async () => {
    const addressId = await seedCartAndAddress()
    const created = await mockCreateOrder({ addressId })

    const result = await mockCancelOrder(created.data.id)

    expect(result.success).toBe(true)
    expect(result.data.status).toBe('cancelled')
  })

  it('completes order after pay flow', async () => {
    const addressId = await seedCartAndAddress()
    const created = await mockCreateOrder({ addressId })

    const payRes = await mockPayOrder(created.data.id)
    expect(payRes.success).toBe(true)
    expect(payRes.data.status).toBe('paid')

    await new Promise(r => setTimeout(r, 1100))

    const shipped = await mockFetchOrder(created.data.id)
    expect(shipped.data.status).toBe('shipped')

    const completeRes = await mockCompleteOrder(created.data.id)
    expect(completeRes.success).toBe(true)
    expect(completeRes.data.status).toBe('completed')
  })
})
