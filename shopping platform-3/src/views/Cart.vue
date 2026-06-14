<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CartItem from '../components/CartItem.vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

onMounted(async () => {
  if (userStore.token) {
    await cartStore.fetchCart()
  }
})

function handleRemove(id: number) {
  cartStore.removeItem(id)
  ElMessage.success('已删除')
}

function goToCheckout() {
  if (cartStore.items.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }
  
  router.push('/order/confirm')
}
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold mb-6">购物车</h2>
        
        <div v-if="cartStore.items.length > 0" class="space-y-4">
          <CartItem 
            v-for="item in cartStore.items" 
            :key="item.id" 
            :item="item"
            @remove="handleRemove"
          />
        </div>
        
        <div v-else class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="mt-4 text-gray-500">购物车为空</p>
          <button 
            class="mt-4 text-primary hover:text-primary/80"
            @click="router.push('/products')"
          >
            去购物 →
          </button>
        </div>
        
        <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 mt-6 pt-6">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-gray-600">共 {{ cartStore.totalCount }} 件商品</span>
            </div>
            <div class="flex items-center space-x-6">
              <div>
                <span class="text-gray-600">合计：</span>
                <span class="text-2xl font-bold text-red-500">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <button 
                class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 font-medium"
                @click="goToCheckout"
              >
                结算
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>