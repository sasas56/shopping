import { describe, it, expect } from 'vitest'
import { getProductImageUrl, getProductImageFallback } from '../utils/productImage'

describe('productImage', () => {
  const productWithLocalImage = {
    id: 1,
    name: '维达抽纸（24包/箱）',
    categoryId: 1,
    image: '/images/维达抽纸24包.png'
  }

  const productWithoutLocalImage = {
    id: 999,
    name: '测试商品（无图）',
    categoryId: 1,
    image: '/images/不存在.jpg'
  }

  it('uses local public image when file exists', () => {
    expect(getProductImageUrl(productWithLocalImage)).toBe('/images/维达抽纸24包.png')
  })

  it('falls back to named placeholder when local image is missing', () => {
    const url = getProductImageUrl(productWithoutLocalImage)
    expect(url).toContain('placehold.co')
    expect(url).toContain('text=')
  })

  it('generates stable fallback with product name', () => {
    const url = getProductImageFallback(productWithLocalImage)
    expect(url).toContain('placehold.co')
    expect(getProductImageFallback(productWithLocalImage)).toBe(url)
  })
})
