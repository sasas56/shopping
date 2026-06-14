<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { useCatalogStore } from '../stores/catalog'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const catalogStore = useCatalogStore()

const searchKeyword = ref('')

const isLoggedIn = computed(() => !!userStore.token)
const categories = computed(() => catalogStore.categories)

async function init() {
  await catalogStore.fetchCategories()
}

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ name: 'productList', query: { keyword: searchKeyword.value } })
  }
}

function logout() {
  userStore.logout()
  cartStore.clearAll()
  wishlistStore.clear()
  router.push('/')
}

init()
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <div class="text-2xl font-bold text-primary cursor-pointer" @click="router.push('/')">
            电商平台
          </div>
          <nav class="hidden md:flex items-center space-x-6">
            <button class="text-gray-700 hover:text-primary" @click="router.push('/')">首页</button>
            <div class="relative group">
              <button class="text-gray-700 hover:text-primary">
                商品分类
              </button>
              <div class="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="router.push({ name: 'productList', query: { categoryId: category.id } })"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
            <button class="text-gray-700 hover:text-primary" @click="router.push('/products')">全部商品</button>
          </nav>
        </div>

        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索商品..."
              class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              @keyup.enter="handleSearch"
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full hover:bg-primary/90"
              @click="handleSearch"
            >
              搜索
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            v-if="isLoggedIn"
            class="relative text-gray-700 hover:text-primary"
            @click="router.push('/cart')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartStore.totalCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              {{ cartStore.totalCount }}
            </span>
          </button>
          
          <div v-if="isLoggedIn" class="flex items-center space-x-4">
            <button class="text-gray-700 hover:text-primary" @click="router.push('/orders')">
              我的订单
            </button>
            <button class="text-gray-700 hover:text-primary" @click="router.push('/user')">
              {{ userStore.user?.username }}
            </button>
            <button class="text-gray-700 hover:text-red-500" @click="logout">
              退出
            </button>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <button class="text-gray-700 hover:text-primary" @click="router.push('/login')">
              登录
            </button>
            <button class="text-gray-700 hover:text-primary" @click="router.push('/register')">
              注册
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
