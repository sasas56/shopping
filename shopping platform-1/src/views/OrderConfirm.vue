<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useOrderStore } from '../stores/order'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const orderStore = useOrderStore()

const selectedAddressId = ref<number | null>(null)

async function init() {
  if (userStore.token) {
    await cartStore.fetchCart()
    await userStore.fetchAddresses()
    
    if (userStore.addresses.length > 0) {
      const defaultAddress = userStore.addresses.find(a => a.isDefault)
      selectedAddressId.value = defaultAddress?.id || userStore.addresses[0].id
    }
  }
}

async function createOrder() {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  if (cartStore.items.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }
  
  try {
    const order = await orderStore.createNewOrder(selectedAddressId.value)
    await cartStore.clearAll()
    ElMessage.success('订单创建成功')
    router.push(`/orders/${order.id}`)
  } catch (error) {
    ElMessage.error('订单创建失败')
  }
}

onMounted(init)
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-bold mb-4">收货地址</h3>
            <div v-if="userStore.addresses.length > 0" class="space-y-4">
              <div 
                v-for="address in userStore.addresses" 
                :key="address.id"
                class="border rounded-lg p-4 cursor-pointer transition-colors"
                :class="{ 'border-primary bg-primary/5': selectedAddressId === address.id, 'border-gray-200 hover:border-gray-300': selectedAddressId !== address.id }"
                @click="selectedAddressId = address.id"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center space-x-2">
                      <span class="font-medium">{{ address.receiver }}</span>
                      <span class="text-gray-500">{{ address.phone }}</span>
                    </div>
                    <div class="mt-1 text-gray-600">
                      {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                    </div>
                  </div>
                  <div v-if="address.isDefault" class="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                    默认
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>暂无收货地址，请先添加地址</p>
              <button 
                class="mt-4 text-primary hover:text-primary/80"
                @click="router.push('/user')"
              >
                去添加地址 →
              </button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="font-bold mb-4">商品清单</h3>
            <div v-if="cartStore.items.length > 0" class="space-y-4">
              <div 
                v-for="item in cartStore.items" 
                :key="item.id"
                class="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <img 
                  :src="item.product?.image" 
                  :alt="item.product?.name"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1 ml-4">
                  <h4 class="text-gray-800">{{ item.product?.name }}</h4>
                  <p class="text-red-500 font-bold">¥{{ item.product?.price.toFixed(2) }}</p>
                </div>
                <div class="text-right">
                  <span class="text-gray-600">x{{ item.quantity }}</span>
                  <p class="font-bold">¥{{ ((item.product?.price || 0) * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>购物车为空</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 class="font-bold mb-4">订单摘要</h3>
            
            <div class="space-y-3 text-gray-600">
              <div class="flex justify-between">
                <span>商品总数</span>
                <span>{{ cartStore.totalCount }} 件</span>
              </div>
              <div class="flex justify-between">
                <span>商品金额</span>
                <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>运费</span>
                <span class="text-green-500">免运费</span>
              </div>
              <div class="border-t border-gray-200 pt-3 mt-3">
                <div class="flex justify-between text-lg font-bold">
                  <span>应付金额</span>
                  <span class="text-red-500">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <button 
              class="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium"
              @click="createOrder"
            >
              提交订单
            </button>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>