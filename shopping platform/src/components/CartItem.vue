<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import type { CartItem } from '../types'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  remove: [id: number]
}>()

const cartStore = useCartStore()

function handleQuantityChange(delta: number) {
  const newQuantity = props.item.quantity + delta
  if (newQuantity <= 0) {
    emit('remove', props.item.id)
  } else {
    cartStore.updateItem(props.item.id, newQuantity)
  }
}

function handleRemove() {
  emit('remove', props.item.id)
}
</script>

<template>
  <div class="flex items-center p-4 bg-white rounded-lg shadow-sm">
    <img 
      :src="item.product?.image" 
      :alt="item.product?.name"
      class="w-20 h-20 object-cover rounded-lg"
    />
    <div class="flex-1 ml-4">
      <h4 class="text-gray-800 font-medium">{{ item.product?.name }}</h4>
      <p class="text-red-500 font-bold mt-2">¥{{ item.product?.price.toFixed(2) }}</p>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center border border-gray-300 rounded">
        <button 
          class="px-3 py-1 hover:bg-gray-100"
          @click="handleQuantityChange(-1)"
        >
          -
        </button>
        <span class="px-4 py-1">{{ item.quantity }}</span>
        <button 
          class="px-3 py-1 hover:bg-gray-100"
          @click="handleQuantityChange(1)"
        >
          +
        </button>
      </div>
      <span class="text-gray-800 font-bold">
        ¥{{ ((item.product?.price || 0) * item.quantity).toFixed(2) }}
      </span>
      <button 
        class="text-gray-400 hover:text-red-500"
        @click="handleRemove"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>