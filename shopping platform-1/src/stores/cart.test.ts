import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cart'

describe('cart store', () => {
  it('calculates totalCount and totalPrice correctly', () => {
    setActivePinia(createPinia())
    const store = useCartStore()

    store.items = [
      { id: 1, userId: 1, productId: 1, quantity: 2, product: { id: 1, name: 'Test', price: 100, stock: 10, description: '', image: '', categoryId: 1, sales: 0, rating: 5, createdAt: '' } },
      { id: 2, userId: 1, productId: 2, quantity: 1, product: { id: 2, name: 'Test2', price: 50, stock: 5, description: '', image: '', categoryId: 1, sales: 0, rating: 4, createdAt: '' } }
    ]

    expect(store.totalCount).toBe(3)
    expect(store.totalPrice).toBe(250)
  })

  it('handles missing product price gracefully', () => {
    setActivePinia(createPinia())
    const store = useCartStore()

    store.items = [
      { id: 1, userId: 1, productId: 1, quantity: 2 }
    ]

    expect(store.totalCount).toBe(2)
    expect(store.totalPrice).toBe(0)
  })
})
