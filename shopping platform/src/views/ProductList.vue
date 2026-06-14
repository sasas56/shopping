<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import { useCatalogStore } from '../stores/catalog'
import { getProducts } from '../api/products'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const catalogStore = useCatalogStore()

const products = ref<Product[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 8

const filters = ref({
  categoryId: Number(route.query.categoryId) || undefined,
  keyword: (route.query.keyword as string) || undefined,
  sortBy: (route.query.sortBy as string) || 'createdAt',
  sortOrder: ((route.query.sortOrder as string) || 'desc') as 'asc' | 'desc'
})

const sortOptions = [
  { label: '综合排序', value: 'createdAt' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '销量最高', value: 'sales' },
  { label: '评分最高', value: 'rating' }
]

const activeSort = computed(() => {
  if (filters.value.sortBy === 'price' && filters.value.sortOrder === 'asc') return 'price_asc'
  if (filters.value.sortBy === 'price' && filters.value.sortOrder === 'desc') return 'price_desc'
  return filters.value.sortBy
})

async function loadProducts() {
  const params: Record<string, unknown> = {
    page: currentPage.value,
    size: pageSize,
    sortBy: filters.value.sortBy,
    sortOrder: filters.value.sortOrder
  }
  
  if (filters.value.categoryId) params.categoryId = filters.value.categoryId
  if (filters.value.keyword) params.keyword = filters.value.keyword
  
  const result = await getProducts(params)
  products.value = result.items
  total.value = result.total
}

function handleCategoryChange(id: number | undefined) {
  filters.value.categoryId = id
  currentPage.value = 1
  updateQuery()
}

function handleSortChange(value: string) {
  if (value === 'price_asc') {
    filters.value.sortBy = 'price'
    filters.value.sortOrder = 'asc'
  } else if (value === 'price_desc') {
    filters.value.sortBy = 'price'
    filters.value.sortOrder = 'desc'
  } else {
    filters.value.sortBy = value
    filters.value.sortOrder = 'desc'
  }
  currentPage.value = 1
  updateQuery()
}

const searchInput = ref(filters.value.keyword || '')

async function handleSearch() {
  filters.value.keyword = searchInput.value.trim() || undefined
  currentPage.value = 1
  updateQuery()
}

function updateQuery() {
  const query: Record<string, string | number> = {}
  if (filters.value.categoryId) query.categoryId = filters.value.categoryId
  if (filters.value.keyword) query.keyword = filters.value.keyword
  if (filters.value.sortBy) {
    query.sortBy = filters.value.sortBy
    query.sortOrder = filters.value.sortOrder
  }
  router.push({ query })
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadProducts()
}

onMounted(async () => {
  await catalogStore.fetchCategories()
  searchInput.value = filters.value.keyword || ''
  await loadProducts()
})

watch(() => route.query, async () => {
  filters.value.categoryId = Number(route.query.categoryId) || undefined
  filters.value.keyword = (route.query.keyword as string) || undefined
  searchInput.value = filters.value.keyword || ''
  filters.value.sortBy = (route.query.sortBy as string) || 'createdAt'
  filters.value.sortOrder = ((route.query.sortOrder as string) || 'desc') as 'asc' | 'desc'
  await loadProducts()
}, { deep: true })
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-48">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="font-bold mb-4">商品分类</h3>
            <ul class="space-y-2">
              <li>
                <button 
                  class="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  :class="{ 'bg-primary text-white': !filters.categoryId }"
                  @click="handleCategoryChange(undefined)"
                >
                  全部商品
                </button>
              </li>
              <li v-for="category in catalogStore.categories" :key="category.id">
                <button 
                  class="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  :class="{ 'bg-primary text-white': filters.categoryId === category.id }"
                  @click="handleCategoryChange(category.id)"
                >
                  {{ category.name }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <div class="flex-1">
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div class="flex-1 max-w-md">
                <div class="relative">
                  <input
                    v-model="searchInput"
                    type="text"
                    placeholder="搜索商品名称..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    @keyup.enter="handleSearch"
                  />
                  <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm hover:text-primary/80"
                    @click="handleSearch"
                  >
                    搜索
                  </button>
                </div>
              </div>
              <div class="text-gray-600">
                共 <span class="font-bold text-primary">{{ total }}</span> 件商品
              </div>
            </div>
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div v-if="filters.keyword" class="text-sm text-gray-500">
                搜索关键词：<span class="text-primary font-medium">{{ filters.keyword }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-gray-500">排序：</span>
                <select 
                  :value="activeSort"
                  @change="handleSortChange(($event.target as HTMLSelectElement).value)"
                  class="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
            />
          </div>

          <div v-else class="text-center py-12 bg-white rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-4 text-gray-500">没有找到相关商品</p>
          </div>

          <div v-if="total > pageSize" class="flex justify-center mt-8">
            <nav class="flex items-center space-x-2">
              <button 
                class="px-3 py-1 border rounded hover:bg-gray-100"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              >
                上一页
              </button>
              <span class="px-3 py-1">{{ currentPage }}</span>
              <button 
                class="px-3 py-1 border rounded hover:bg-gray-100"
                :disabled="currentPage * pageSize >= total"
                @click="handlePageChange(currentPage + 1)"
              >
                下一页
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>