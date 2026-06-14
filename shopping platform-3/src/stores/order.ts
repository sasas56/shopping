import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '../types'
import { getOrders, getOrder, createOrder, cancelOrder, payOrder, completeOrder } from '../api/orders'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const total = ref(0)

  async function fetchOrders(page: number = 1, size: number = 10, status?: string) {
    const result = await getOrders({ page, size, status })
    orders.value = result.items
    total.value = result.total
  }

  async function fetchOrder(id: number) {
    currentOrder.value = await getOrder(id)
    return currentOrder.value
  }

  async function createNewOrder(addressId: number) {
    const result = await createOrder({ addressId })
    return result
  }

  async function cancelOrderById(id: number) {
    await cancelOrder(id)
    await fetchOrders()
  }

  async function payOrderById(id: number) {
    await payOrder(id)
    await fetchOrders()
  }

  async function completeOrderById(id: number) {
    await completeOrder(id)
    await fetchOrders()
  }

  return {
    orders,
    currentOrder,
    total,
    fetchOrders,
    fetchOrder,
    createNewOrder,
    cancelOrderById,
    payOrderById,
    completeOrderById
  }
})