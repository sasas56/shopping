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
const currentPage = ref(Math.max(1, Number(route.query.page) || 1))
const pageSize = 8
const loading = ref(false)
const errorMsg = ref('')

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

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

async function loadProducts() {
  loading.value = true
  errorMsg.value = ''
  try {
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
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : '加载商品失败，请稍后重试'
    products.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleCategoryChange(id: number | undefined) {
  filters.value.categoryId = id
  currentPage.value = 1
  updateQuery()
  loadProducts()
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
  loadProducts()
}

const searchInput = ref(filters.value.keyword || '')

async function handleSearch() {
  filters.value.keyword = searchInput.value.trim() || undefined
  currentPage.value = 1
  updateQuery()
  loadProducts()
}

function updateQuery() {
  const query: Record<string, string | number> = {}
  if (filters.value.categoryId) query.categoryId = filters.value.categoryId
  if (filters.value.keyword) query.keyword = filters.value.keyword
  if (filters.value.sortBy) {
    query.sortBy = filters.value.sortBy
    query.sortOrder = filters.value.sortOrder
  }
  if (currentPage.value > 1) query.page = currentPage.value
  router.push({ query })
}

function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  updateQuery()
  loadProducts()
}

function retry() {
  loadProducts()
}

onMounted(async () => {
  await catalogStore.fetchCategories()
  searchInput.value = filters.value.keyword || ''
  await loadProducts()
})

watch(() => route.query, async () => {
  const newCategory = Number(route.query.categoryId) || undefined
  const newKeyword = (route.query.keyword as string) || undefined
  const newSortBy = (route.query.sortBy as string) || 'createdAt'
  const newSortOrder = ((route.query.sortOrder as string) || 'desc') as 'asc' | 'desc'
  const newPage = Math.max(1, Number(route.query.page) || 1)

  const filtersChanged =
    newCategory !== filters.value.categoryId ||
    newKeyword !== filters.value.keyword ||
    newSortBy !== filters.value.sortBy ||
    newSortOrder !== filters.value.sortOrder
  const pageChanged = newPage !== currentPage.value

  filters.value.categoryId = newCategory
  filters.value.keyword = newKeyword
  filters.value.sortBy = newSortBy
  filters.value.sortOrder = newSortOrder
  searchInput.value = newKeyword || ''

  if (filtersChanged) {
    currentPage.value = 1
    await loadProducts()
  } else if (pageChanged) {
    currentPage.value = newPage
    await loadProducts()
  }
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

          <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="i in pageSize" :key="i" class="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div class="w-full aspect-square bg-gray-200 rounded mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          <div v-else-if="errorMsg" class="text-center py-12 bg-white rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="mt-4 text-gray-600">{{ errorMsg }}</p>
            <button
              class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              @click="retry"
            >
              重新加载
            </button>
          </div>

          <div v-else-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

          <div v-if="!loading && total > pageSize" class="flex justify-center mt-8">
            <nav class="flex items-center space-x-2">
              <button
                class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              >
                上一页
              </button>
              <span class="px-3 py-1 bg-primary text-white rounded">{{ currentPage }}</span>
              <span class="px-3 py-1 text-gray-500">/ {{ totalPages }}</span>
              <button
                class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage >= totalPages"
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
