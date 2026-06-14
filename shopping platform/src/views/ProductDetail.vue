<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { getProduct, getProductReviews, addProductReview } from '../api/products'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useWishlistStore } from '../stores/wishlist'
import type { Product, Review } from '../types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const wishlistStore = useWishlistStore()

const product = ref<Product | null>(null)
const reviews = ref<Review[]>([])
const reviewTotal = ref(0)
const quantity = ref(1)
const isWishlisted = ref(false)

const reviewForm = ref({
  rating: 5,
  content: ''
})
const showReviewForm = ref(false)

async function loadProduct() {
  const id = Number(route.params.id)
  const [productData, reviewData] = await Promise.all([
    getProduct(id),
    getProductReviews(id, { page: 1, size: 10 })
  ])
  product.value = productData
  reviews.value = reviewData.items
  reviewTotal.value = reviewData.total
  isWishlisted.value = wishlistStore.isWishlisted(id)
}

function checkLogin(): boolean {
  if (!userStore.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return false
  }
  return true
}

async function addToCart() {
  if (!product.value) return
  if (!checkLogin()) return
  
  await cartStore.addItem(product.value.id, quantity.value)
  ElMessage.success('已添加到购物车')
}

async function buyNow() {
  if (!product.value) return
  if (!checkLogin()) return
  
  await cartStore.addItem(product.value.id, quantity.value)
  router.push('/order/confirm')
}

async function toggleWishlist() {
  if (!product.value) return
  if (!checkLogin()) return
  
  isWishlisted.value = await wishlistStore.toggle(product.value.id)
  ElMessage.success(isWishlisted.value ? '已加入收藏' : '已取消收藏')
}

async function submitReview() {
  if (!product.value) return
  if (!checkLogin()) return
  
  if (!reviewForm.value.content.trim()) {
    ElMessage.warning('请输入评价内容')
    return
  }
  
  try {
    const review = await addProductReview(product.value.id, reviewForm.value)
    reviews.value.unshift(review)
    reviewTotal.value++
    reviewForm.value = { rating: 5, content: '' }
    showReviewForm.value = false
    product.value = await getProduct(product.value.id)
    ElMessage.success('评价提交成功')
  } catch {
    ElMessage.error('评价提交失败，您可能已评价过该商品')
  }
}

onMounted(loadProduct)
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div v-if="product" class="space-y-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/2 p-8">
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="product.image" 
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div class="lg:w-1/2 p-8">
              <h1 class="text-2xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>
              
              <div class="flex items-center space-x-4 mb-4">
                <span class="text-yellow-500">★</span>
                <span class="text-gray-600">{{ product.rating }}</span>
                <span class="text-gray-400">已售 {{ product.sales }}</span>
                <span class="text-gray-400">{{ reviewTotal }} 条评价</span>
              </div>
              
              <div class="text-3xl font-bold text-red-500 mb-4">
                ¥{{ product.price.toFixed(2) }}
              </div>
              
              <div class="text-gray-600 mb-6">{{ product.description }}</div>
              
              <div class="flex items-center space-x-4 mb-8">
                <span class="text-gray-600">数量：</span>
                <div class="flex items-center border border-gray-300 rounded">
                  <button 
                    class="px-4 py-2 hover:bg-gray-100"
                    @click="quantity = Math.max(1, quantity - 1)"
                  >
                    -
                  </button>
                  <span class="px-6 py-2">{{ quantity }}</span>
                  <button 
                    class="px-4 py-2 hover:bg-gray-100"
                    @click="quantity = Math.min(product.stock, quantity + 1)"
                  >
                    +
                  </button>
                </div>
                <span class="text-gray-400 text-sm">库存：{{ product.stock }}件</span>
              </div>
              
              <div class="flex space-x-4">
                <button 
                  class="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium"
                  @click="addToCart"
                >
                  加入购物车
                </button>
                <button 
                  class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-500/90 font-medium"
                  @click="buyNow"
                >
                  立即购买
                </button>
                <button 
                  class="px-4 py-3 border rounded-lg hover:bg-gray-50"
                  :class="isWishlisted ? 'text-red-500 border-red-200' : 'text-gray-600'"
                  @click="toggleWishlist"
                >
                  {{ isWishlisted ? '已收藏' : '收藏' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">商品评价 ({{ reviewTotal }})</h2>
            <button 
              class="text-primary hover:text-primary/80"
              @click="showReviewForm = !showReviewForm"
            >
              {{ showReviewForm ? '取消评价' : '写评价' }}
            </button>
          </div>

          <div v-if="showReviewForm" class="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label class="block text-gray-600 mb-2">评分</label>
              <div class="flex space-x-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  class="text-2xl"
                  :class="star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'"
                  @click="reviewForm.rating = star"
                >
                  ★
                </button>
              </div>
            </div>
            <div>
              <label class="block text-gray-600 mb-2">评价内容</label>
              <textarea
                v-model="reviewForm.content"
                rows="3"
                placeholder="分享您的使用体验..."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              ></textarea>
            </div>
            <button 
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              @click="submitReview"
            >
              提交评价
            </button>
          </div>

          <div v-if="reviews.length > 0" class="space-y-4">
            <div 
              v-for="review in reviews" 
              :key="review.id"
              class="border-b pb-4 last:border-b-0"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ review.username }}</span>
                  <span class="text-yellow-500 text-sm">
                    {{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}
                  </span>
                </div>
                <span class="text-gray-400 text-sm">
                  {{ new Date(review.createdAt).toLocaleDateString() }}
                </span>
              </div>
              <p class="text-gray-600">{{ review.content }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            暂无评价，快来发表第一条评价吧
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
