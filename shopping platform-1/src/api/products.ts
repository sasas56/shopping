import request from '../utils/request'
import type { Product, Category, PageResult, Review } from '../types'

export function getProducts(params?: {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return request.get<PageResult<Product>>('/products', { params })
}

export function getProduct(id: number) {
  return request.get<Product>(`/products/${id}`)
}

export function getCategories() {
  return request.get<Category[]>('/products/categories')
}

export function getProductReviews(productId: number, params?: { page?: number; size?: number }) {
  return request.get<PageResult<Review>>(`/products/${productId}/reviews`, { params })
}

export function addProductReview(productId: number, data: { rating: number; content: string }) {
  return request.post<Review>(`/products/${productId}/reviews`, data)
}