import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '../types'
import { getCart, addToCart, updateCartItem, deleteCartItem, clearCart } from '../api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity
    }, 0)
  })

  async function fetchCart() {
    items.value = await getCart()
  }

  async function addItem(productId: number, quantity: number = 1) {
    const result = await addToCart({ productId, quantity })
    const existingIndex = items.value.findIndex(i => i.id === result.id)
    if (existingIndex !== -1) {
      items.value[existingIndex] = result
    } else {
      items.value.push(result)
    }
  }

  async function updateItem(id: number, quantity: number) {
    if (quantity <= 0) {
      await removeItem(id)
      return
    }
    const result = await updateCartItem(id, quantity)
    const index = items.value.findIndex(i => i.id === id)
    if (index !== -1) {
      items.value[index] = result
    }
  }

  async function removeItem(id: number) {
    await deleteCartItem(id)
    items.value = items.value.filter(i => i.id !== id)
  }

  async function clearAll() {
    await clearCart()
    items.value = []
  }

  return {
    items,
    totalCount,
    totalPrice,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearAll
  }
})