<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useOrderStore } from '../stores/order'
import type { OrderStatus } from '../types'

const router = useRouter()
const orderStore = useOrderStore()

const statusFilter = ref<OrderStatus | 'all'>('all')

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

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

async function handleStatusChange(status: OrderStatus | 'all') {
  statusFilter.value = status
  await orderStore.fetchOrders(1, 10, status === 'all' ? undefined : status)
}

async function handleCancel(orderId: number) {
  await orderStore.cancelOrderById(orderId)
  ElMessage.success('订单已取消')
}

async function handlePay(orderId: number) {
  await orderStore.payOrderById(orderId)
  ElMessage.success('支付成功')
}

async function handleComplete(orderId: number) {
  await orderStore.completeOrderById(orderId)
  ElMessage.success('已确认收货')
}

onMounted(async () => {
  await orderStore.fetchOrders()
})
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">我的订单</h2>
          <div class="flex items-center space-x-2">
            <button 
              v-for="option in statusOptions" 
              :key="option.value"
              class="px-4 py-2 rounded-lg transition-colors"
              :class="{ 'bg-primary text-white': statusFilter === option.value, 'bg-gray-100 hover:bg-gray-200': statusFilter !== option.value }"
              @click="handleStatusChange(option.value as OrderStatus | 'all')"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div v-if="orderStore.orders.length > 0" class="space-y-6">
          <div 
            v-for="order in orderStore.orders" 
            :key="order.id"
            class="border rounded-lg overflow-hidden"
          >
            <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div class="text-gray-600">
                订单号：{{ order.id }}
              </div>
              <div class="text-gray-400 text-sm">
                {{ new Date(order.createdAt).toLocaleString() }}
              </div>
            </div>
            
            <div class="p-4">
              <div v-if="order.items" class="space-y-3">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="flex items-center"
                >
                  <img 
                    :src="item.product?.image" 
                    :alt="item.product?.name"
                    class="w-16 h-16 object-cover rounded"
                  />
                  <div class="flex-1 ml-4">
                    <h4 class="text-gray-800">{{ item.product?.name }}</h4>
                    <div class="flex items-center space-x-4 mt-1">
                      <span class="text-red-500">¥{{ item.price.toFixed(2) }}</span>
                      <span class="text-gray-500">x{{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t px-4 py-3 flex items-center justify-between">
              <div>
                <span class="text-gray-600">合计：</span>
                <span class="text-xl font-bold text-red-500">¥{{ order.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="['font-medium', getStatusClass(order.status)]">
                  {{ getStatusLabel(order.status) }}
                </span>
                <div class="flex space-x-2">
                  <button 
                    v-if="order.status === 'pending'"
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                    @click="handlePay(order.id)"
                  >
                    立即支付
                  </button>
                  <button 
                    v-if="order.status === 'pending'"
                    class="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                    @click="handleCancel(order.id)"
                  >
                    取消订单
                  </button>
                  <button 
                    v-if="order.status === 'shipped'"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500/90 text-sm"
                    @click="handleComplete(order.id)"
                  >
                    确认收货
                  </button>
                  <button 
                    class="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                    @click="router.push(`/orders/${order.id}`)"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="mt-4 text-gray-500">暂无订单</p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>