import request from '../utils/request'
import type { Order, PageResult } from '../types'

export function getOrders(params?: {
  page?: number
  size?: number
  status?: string
}) {
  return request.get<PageResult<Order>>('/orders', { params })
}

export function getOrder(id: number) {
  return request.get<Order>(`/orders/${id}`)
}

export function createOrder(data: { addressId: number }) {
  return request.post<Order>('/orders', data)
}

export function cancelOrder(id: number) {
  return request.put(`/orders/${id}/cancel`)
}

export function payOrder(id: number) {
  return request.put(`/orders/${id}/pay`)
}

export function completeOrder(id: number) {
  return request.put(`/orders/${id}/complete`)
}