<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useWishlistStore } from '../stores/wishlist'
import type { Product } from '../types'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const userStore = useUserStore()
const wishlistStore = useWishlistStore()

const isWishlisted = ref(false)

onMounted(() => {
  isWishlisted.value = wishlistStore.isWishlisted(props.product.id)
})

function goToDetail() {
  router.push(`/products/${props.product.id}`)
}

async function toggleWishlist(event: Event) {
  event.stopPropagation()
  if (!userStore.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  isWishlisted.value = await wishlistStore.toggle(props.product.id)
  ElMessage.success(isWishlisted.value ? '已加入收藏' : '已取消收藏')
}
</script>

<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden product-card cursor-pointer relative"
    @click="goToDetail"
  >
    <button
      class="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
      @click="toggleWishlist"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        :class="isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'"
        :fill="isWishlisted ? 'currentColor' : 'none'"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
    <div class="aspect-square bg-gray-100">
      <img 
        :src="product.image" 
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-gray-800 font-medium mb-2 line-clamp-2 h-10">
        {{ product.name }}
      </h3>
      <div class="flex items-center mb-2">
        <span class="text-yellow-500 text-sm">★</span>
        <span class="text-gray-600 text-sm ml-1">{{ product.rating }}</span>
        <span class="text-gray-400 text-sm ml-2">已售 {{ product.sales }}</span>
      </div>
      <div class="text-xl font-bold text-red-500">
        ¥{{ product.price.toFixed(2) }}
      </div>
    </div>
  </div>
</template>
