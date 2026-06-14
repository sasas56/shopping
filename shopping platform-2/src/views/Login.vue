<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { getApiErrorMessage } from '../utils/apiError'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const username = ref('')
const password = ref('')

async function handleLogin() {
  if (!username.value.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!password.value.trim()) {
    ElMessage.warning('请输入密码')
    return
  }
  
  try {
    await userStore.login(username.value, password.value)
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '登录失败，请检查用户名或密码'))
    return
  }

  try {
    await Promise.all([
      cartStore.fetchCart(),
      wishlistStore.fetchIds()
    ])
  } catch {
    // 登录已成功，购物车/收藏加载失败不阻断登录流程
  }

  ElMessage.success('登录成功')
  const redirect = route.query.redirect as string
  router.push(redirect || '/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">用户登录</h2>
        <p class="text-gray-500 mt-2">欢迎来到电商购物平台</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-gray-600 mb-2">用户名</label>
          <input 
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-gray-600 mb-2">密码</label>
          <input 
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <button 
          type="submit"
          class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium"
        >
          登录
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <span class="text-gray-500">还没有账号？</span>
        <button 
          class="text-primary hover:text-primary/80 ml-2"
          @click="router.push('/register')"
        >
          立即注册
        </button>
      </div>
    </div>
  </div>
</template>