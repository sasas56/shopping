<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useOrderStore } from '../stores/order'
import type { OrderStatus } from '../types'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref<typeof orderStore.currentOrder>(null)

function getStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status]
}

function getStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: 'status-pending',
    paid: 'status-paid',
    shipped: 'status-shipped',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return map[status]
}

async function loadOrder() {
  const id = Number(route.params.id)
  order.value = await orderStore.fetchOrder(id)
}

async function handleCancel() {
  if (!order.value) return
  await orderStore.cancelOrderById(order.value.id)
  ElMessage.success('订单已取消')
  router.push('/orders')
}

async function handlePay() {
  if (!order.value) return
  await orderStore.payOrderById(order.value.id)
  ElMessage.success('支付成功')
  await loadOrder()
}

async function handleComplete() {
  if (!order.value) return
  await orderStore.completeOrderById(order.value.id)
  ElMessage.success('已确认收货')
  await loadOrder()
}

onMounted(loadOrder)
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div v-if="order" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div class="text-gray-600">
            订单号：{{ order.id }}
          </div>
          <span :class="['font-medium', getStatusClass(order.status)]">
            {{ getStatusLabel(order.status) }}
          </span>
        </div>
        
        <div class="p-6 border-b">
          <h3 class="font-bold mb-4">收货信息</h3>
          <div v-if="order.address" class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div class="ml-3">
              <div class="flex items-center space-x-4">
                <span class="font-medium">{{ order.address.receiver }}</span>
                <span class="text-gray-500">{{ order.address.phone }}</span>
              </div>
              <div class="mt-1 text-gray-600">
                {{ order.address.province }} {{ order.address.city }} {{ order.address.district }} {{ order.address.detail }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <h3 class="font-bold mb-4">商品清单</h3>
          <div v-if="order.items" class="space-y-4">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <img 
                :src="item.product?.image" 
                :alt="item.product?.name"
                class="w-20 h-20 object-cover rounded"
              />
              <div class="flex-1 ml-4">
                <h4 class="text-gray-800">{{ item.product?.name }}</h4>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-red-500 font-bold">¥{{ item.price.toFixed(2) }}</span>
                  <span class="text-gray-500">x{{ item.quantity }}</span>
                </div>
              </div>
              <div class="font-bold">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <h3 class="font-bold mb-4">订单信息</h3>
          <div class="space-y-2 text-gray-600">
            <div class="flex justify-between">
              <span>下单时间</span>
              <span>{{ new Date(order.createdAt).toLocaleString() }}</span>
            </div>
            <div v-if="order.payTime" class="flex justify-between">
              <span>支付时间</span>
              <span>{{ new Date(order.payTime).toLocaleString() }}</span>
            </div>
            <div v-if="order.shipTime" class="flex justify-between">
              <span>发货时间</span>
              <span>{{ new Date(order.shipTime).toLocaleString() }}</span>
            </div>
            <div v-if="order.completeTime" class="flex justify-between">
              <span>完成时间</span>
              <span>{{ new Date(order.completeTime).toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-gray-600">应付金额：</span>
              <span class="text-2xl font-bold text-red-500">¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
            <div class="flex space-x-3">
              <button 
                v-if="order.status === 'pending'"
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                @click="handlePay"
              >
                立即支付
              </button>
              <button 
                v-if="order.status === 'pending'"
                class="px-6 py-2 border rounded-lg hover:bg-gray-100"
                @click="handleCancel"
              >
                取消订单
              </button>
              <button 
                v-if="order.status === 'shipped'"
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500/90"
                @click="handleComplete"
              >
                确认收货
              </button>
              <button 
                class="px-6 py-2 border rounded-lg hover:bg-gray-100"
                @click="router.push('/orders')"
              >
                返回订单列表
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>