import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCatalogStore } from './catalog'

vi.mock('../api/products', () => ({
  getCategories: vi.fn(() => Promise.resolve([
    { id: 1, name: '数码电子', parentId: null, sortOrder: 1 },
    { id: 2, name: '运动户外', parentId: null, sortOrder: 2 }
  ]))
}))

describe('catalog store', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('caches categories after first fetch', async () => {
    const store = useCatalogStore()
    const { getCategories } = await import('../api/products')

    await store.fetchCategories()
    await store.fetchCategories()

    expect(getCategories).toHaveBeenCalledTimes(1)
    expect(store.categories).toHaveLength(2)
    expect(store.loaded).toBe(true)
  })

  it('refetches when force is true', async () => {
    const store = useCatalogStore()
    const { getCategories } = await import('../api/products')

    await store.fetchCategories()
    await store.fetchCategories(true)

    expect(getCategories).toHaveBeenCalledTimes(2)
  })
})
