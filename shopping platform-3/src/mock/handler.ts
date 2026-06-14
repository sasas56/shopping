import {
  mockFetchProducts,
  mockFetchProduct,
  mockFetchCategories,
  mockFetchProductReviews,
  mockFetchCart,
  mockAddToCart,
  mockUpdateCartItem,
  mockDeleteCartItem,
  mockClearCart,
  mockFetchWishlist,
  mockFetchWishlistIds,
  mockAddToWishlist,
  mockRemoveFromWishlist,
  mockFetchAddresses,
  mockAddAddress,
  mockUpdateAddress,
  mockDeleteAddress,
  mockLogin,
  mockRegister,
  mockGetUserInfo,
  mockUpdateUserInfo,
  mockFetchOrders,
  mockFetchOrder,
  mockCreateOrder,
  mockCancelOrder,
  mockPayOrder,
  mockCompleteOrder,
  type ApiResult
} from './data'
import type { Address } from '../types'

export type MockHandler = (path: string, query: Record<string, unknown>) => Promise<ApiResult<unknown>>

const handlers: Array<{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  match: (path: string) => boolean
  handle: (query: Record<string, unknown>, body: unknown, path: string) => Promise<ApiResult<unknown>>
}> = [
  {
    method: 'POST',
    match: path => path === '/users/login',
    handle: (_q, body) => mockLogin(body as { username?: string; password?: string })
  },
  {
    method: 'POST',
    match: path => path === '/users/register',
    handle: (_q, body) => mockRegister(body as { username?: string; password?: string; email?: string; phone?: string })
  },
  {
    method: 'GET',
    match: path => path === '/users/me',
    handle: () => mockGetUserInfo()
  },
  {
    method: 'PUT',
    match: path => path === '/users/me',
    handle: (_q, body) => mockUpdateUserInfo(body as { email?: string; phone?: string })
  },
  {
    method: 'GET',
    match: path => /^\/products\/categories$/.test(path),
    handle: () => mockFetchCategories()
  },
  {
    method: 'GET',
    match: path => /^\/products\/\d+\/reviews$/.test(path),
    handle: (query, _b, path) => {
      const id = Number(path.split('/')[2])
      return mockFetchProductReviews(id, query as never)
    }
  },
  {
    method: 'GET',
    match: path => /^\/products\/\d+$/.test(path),
    handle: (_q, _b, path) => {
      const id = Number(path.split('/').pop())
      return mockFetchProduct(id)
    }
  },
  {
    method: 'GET',
    match: path => /^\/products$/.test(path),
    handle: query => mockFetchProducts(query as never)
  },
  {
    method: 'GET',
    match: path => path === '/wishlist/ids',
    handle: () => mockFetchWishlistIds()
  },
  {
    method: 'GET',
    match: path => path === '/wishlist',
    handle: () => mockFetchWishlist()
  },
  {
    method: 'POST',
    match: path => path === '/wishlist',
    handle: (_q, body) => mockAddToWishlist(body as { productId?: number })
  },
  {
    method: 'DELETE',
    match: path => /^\/wishlist\/\d+$/.test(path),
    handle: (_q, _b, path) => mockRemoveFromWishlist(Number(path.split('/').pop()))
  },
  {
    method: 'GET',
    match: path => path === '/cart',
    handle: () => mockFetchCart()
  },
  {
    method: 'POST',
    match: path => path === '/cart',
    handle: (_q, body) => mockAddToCart(body as { productId?: number; quantity?: number })
  },
  {
    method: 'PUT',
    match: path => /^\/cart\/\d+$/.test(path),
    handle: (_q, body, path) => mockUpdateCartItem(Number(path.split('/').pop()), body as { quantity?: number })
  },
  {
    method: 'DELETE',
    match: path => /^\/cart\/\d+$/.test(path),
    handle: (_q, _b, path) => mockDeleteCartItem(Number(path.split('/').pop()))
  },
  {
    method: 'DELETE',
    match: path => path === '/cart',
    handle: () => mockClearCart()
  },
  {
    method: 'GET',
    match: path => path === '/users/addresses',
    handle: () => mockFetchAddresses()
  },
  {
    method: 'POST',
    match: path => path === '/users/addresses',
    handle: (_q, body) => mockAddAddress(body as Partial<Address>)
  },
  {
    method: 'PUT',
    match: path => /^\/users\/addresses\/\d+$/.test(path),
    handle: (_q, body, path) => mockUpdateAddress(Number(path.split('/').pop()), body as Partial<Address>)
  },
  {
    method: 'DELETE',
    match: path => /^\/users\/addresses\/\d+$/.test(path),
    handle: (_q, _b, path) => mockDeleteAddress(Number(path.split('/').pop()))
  },
  {
    method: 'GET',
    match: path => path === '/orders',
    handle: query => mockFetchOrders(query as never)
  },
  {
    method: 'GET',
    match: path => /^\/orders\/\d+$/.test(path),
    handle: (_q, _b, path) => mockFetchOrder(Number(path.split('/').pop()))
  },
  {
    method: 'POST',
    match: path => path === '/orders',
    handle: (_q, body) => mockCreateOrder(body as { addressId?: number })
  },
  {
    method: 'PUT',
    match: path => /^\/orders\/\d+\/cancel$/.test(path),
    handle: (_q, _b, path) => mockCancelOrder(Number(path.split('/')[2]))
  },
  {
    method: 'PUT',
    match: path => /^\/orders\/\d+\/pay$/.test(path),
    handle: (_q, _b, path) => mockPayOrder(Number(path.split('/')[2]))
  },
  {
    method: 'PUT',
    match: path => /^\/orders\/\d+\/complete$/.test(path),
    handle: (_q, _b, path) => mockCompleteOrder(Number(path.split('/')[2]))
  }
]

export function findMockHandler(method: string, path: string) {
  return handlers.find(h => h.method === method && h.match(path))
}

export function listMockRoutes() {
  return handlers.map(h => `${h.method} ${h.match.toString().slice(0, 60)}`)
}
