import request from '../utils/request'
import type { CartItem } from '../types'

export function getCart() {
  return request.get<CartItem[]>('/cart')
}

export function addToCart(data: { productId: number; quantity: number }) {
  return request.post<CartItem>('/cart', data)
}

export function updateCartItem(id: number, quantity: number) {
  return request.put<CartItem>(`/cart/${id}`, { quantity })
}

export function deleteCartItem(id: number) {
  return request.delete(`/cart/${id}`)
}

export function clearCart() {
  return request.delete('/cart')
}