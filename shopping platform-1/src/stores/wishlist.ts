import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WishlistItem } from '../types'
import { getWishlist, getWishlistIds, addToWishlist, removeFromWishlist } from '../api/wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const productIds = ref<Set<number>>(new Set())

  const count = computed(() => items.value.length)

  async function fetchWishlist() {
    items.value = await getWishlist()
    productIds.value = new Set(items.value.map(i => i.productId))
  }

  async function fetchIds() {
    const ids = await getWishlistIds()
    productIds.value = new Set(ids)
  }

  function isWishlisted(productId: number) {
    return productIds.value.has(productId)
  }

  async function toggle(productId: number) {
    if (productIds.value.has(productId)) {
      await removeFromWishlist(productId)
      productIds.value.delete(productId)
      items.value = items.value.filter(i => i.productId !== productId)
      return false
    }

    const result = await addToWishlist(productId)
    productIds.value.add(productId)
    items.value.push(result)
    return true
  }

  async function remove(productId: number) {
    await removeFromWishlist(productId)
    productIds.value.delete(productId)
    items.value = items.value.filter(i => i.productId !== productId)
  }

  function clear() {
    items.value = []
    productIds.value = new Set()
  }

  return {
    items,
    count,
    fetchWishlist,
    fetchIds,
    isWishlisted,
    toggle,
    remove,
    clear
  }
})
