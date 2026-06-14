<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'

const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

onMounted(async () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      userStore.user = JSON.parse(savedUser)
    } catch {
      console.error('Failed to parse saved user')
    }
  }
  
  if (userStore.token) {
    try {
      await Promise.all([
        cartStore.fetchCart(),
        wishlistStore.fetchIds()
      ])
    } catch (error) {
      console.warn('Failed to fetch user data (may not be logged in)', error)
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <router-view />
  </div>
</template>
