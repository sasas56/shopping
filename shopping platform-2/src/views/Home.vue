<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductImage from '../components/ProductImage.vue'
import { useCatalogStore } from '../stores/catalog'
import { getProducts } from '../api/products'
import type { Product } from '../types'

const router = useRouter()
const catalogStore = useCatalogStore()
const products = ref<Product[]>([])
const banners = [
  { id: 1, image: 'https://picsum.photos/id/1011/1200/400', title: '家居日用品专场' },
  { id: 2, image: 'https://picsum.photos/id/1080/1200/400', title: '休闲零食特惠' },
  { id: 3, image: 'https://picsum.photos/id/26/1200/400', title: '美妆护肤新品' }
]

onMounted(async () => {
  const [result] = await Promise.all([
    getProducts({ page: 1, size: 8 }),
    catalogStore.fetchCategories()
  ])
  products.value = result.items
})

function goToCategory(id: number) {
  router.push({ name: 'productList', query: { categoryId: id } })
}
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main>
      <div class="relative overflow-hidden">
        <div class="flex animate-slide">
          <div 
            v-for="banner in banners" 
            :key="banner.id"
            class="flex-shrink-0 w-full"
          >
            <img 
              :src="banner.image" 
              :alt="banner.title"
              loading="lazy"
              class="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </div>
      </div>

      <section class="py-8 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-xl font-bold mb-6">商品分类</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="category in catalogStore.categories" 
              :key="category.id"
              class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="goToCategory(category.id)"
            >
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <span class="text-gray-700 text-sm">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="py-8">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">热门推荐</h2>
            <button class="text-primary hover:text-primary/80" @click="router.push('/products')">
              查看更多 →
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
            />
          </div>
        </div>
      </section>

      <section class="py-8 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-xl font-bold mb-6">限时特惠</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              v-for="product in products.slice(0, 4)" 
              :key="'sale-' + product.id"
              class="bg-white rounded-lg shadow-md overflow-hidden product-card cursor-pointer"
              @click="router.push(`/products/${product.id}`)"
            >
              <div class="relative">
                <div class="aspect-square bg-gray-100">
                  <ProductImage :product="product" />
                </div>
                <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  限时特价
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-gray-800 font-medium mb-2 line-clamp-2 h-10">
                  {{ product.name }}
                </h3>
                <div class="flex items-center space-x-2">
                  <span class="text-xl font-bold text-red-500">
                    ¥{{ (product.price * 0.8).toFixed(2) }}
                  </span>
                  <span class="text-gray-400 line-through text-sm">
                    ¥{{ product.price.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
