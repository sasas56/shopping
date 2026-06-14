export interface User {
  id: number
  username: string
  email: string
  phone: string
  createdAt: string
}

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  description: string
  image: string
  categoryId: number
  sales: number
  rating: number
  createdAt: string
}

/** 商品促销信息，由父组件组装后通过 props 传给子组件 */
export interface ProductPromotion {
  active: boolean
  tag: string
  discountLabel?: string
  endTime: string
  originalPrice?: number
}

export interface Category {
  id: number
  name: string
  parentId: number | null
  sortOrder: number
}

export interface CartItem {
  id: number
  userId: number
  productId: number
  quantity: number
  product?: Product
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

export interface Order {
  id: number
  userId: number
  addressId: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  payTime: string | null
  shipTime: string | null
  completeTime: string | null
  address?: Address
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product?: Product
}

export interface Address {
  id: number
  userId: number
  receiver: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  email: string
  phone: string
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface Review {
  id: number
  productId: number
  userId: number
  username: string
  rating: number
  content: string
  createdAt: string
}

export interface WishlistItem {
  id: number
  userId: number
  productId: number
  createdAt: string
  product?: Product
}