import request from '../utils/request'
import type { WishlistItem } from '../types'

export function getWishlist() {
  return request.get<WishlistItem[]>('/wishlist')
}

export function getWishlistIds() {
  return request.get<number[]>('/wishlist/ids')
}

export function addToWishlist(productId: number) {
  return request.post<WishlistItem>('/wishlist', { productId })
}

export function removeFromWishlist(productId: number) {
  return request.delete(`/wishlist/${productId}`)
}
