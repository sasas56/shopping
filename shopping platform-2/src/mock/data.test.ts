import { describe, it, expect } from 'vitest'
import { mockFetchProducts, mockFetchCategories } from './data'

describe('mockFetchProducts', () => {
  it('returns paginated items — each page request is independent', async () => {
    const page1 = await mockFetchProducts({ page: 1, size: 8 })
    const page2 = await mockFetchProducts({ page: 2, size: 8 })

    expect(page1.success).toBe(true)
    expect(page2.success).toBe(true)
    expect(page1.data.items).toHaveLength(8)
    expect(page2.data.items).toHaveLength(8)
    expect(page1.data.page).toBe(1)
    expect(page2.data.page).toBe(2)
    expect(page1.data.items[0].id).not.toBe(page2.data.items[0].id)
  })

  it('filters by categoryId', async () => {
    const all = await mockFetchProducts({ page: 1, size: 100 })
    const beauty = await mockFetchProducts({ page: 1, size: 100, categoryId: 3 })

    expect(beauty.data.total).toBeLessThan(all.data.total)
    expect(beauty.data.items.every(p => p.categoryId === 3)).toBe(true)
  })

  it('filters by keyword', async () => {
    const result = await mockFetchProducts({ page: 1, size: 100, keyword: '面膜' })

    expect(result.data.total).toBeGreaterThan(0)
    expect(result.data.items.every(p =>
      p.name.includes('面膜') || p.description.includes('面膜')
    )).toBe(true)
  })

  it('resets pagination when category changes', async () => {
    const cat1Page1 = await mockFetchProducts({ page: 1, size: 8, categoryId: 1 })
    const cat1Page2 = await mockFetchProducts({ page: 2, size: 8, categoryId: 1 })
    const cat3Page1 = await mockFetchProducts({ page: 1, size: 8, categoryId: 3 })

    expect(cat1Page1.data.total).not.toBe(cat3Page1.data.total)
    expect(cat1Page2.data.page).toBe(2)
    expect(cat3Page1.data.page).toBe(1)
  })
})

describe('mockFetchCategories', () => {
  it('returns category list', async () => {
    const result = await mockFetchCategories()
    expect(result.success).toBe(true)
    expect(result.data.length).toBeGreaterThanOrEqual(5)
  })
})
