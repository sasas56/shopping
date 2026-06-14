<script setup lang="ts">
import type { ProductPromotion } from '../types'

defineProps<{
  promotion: ProductPromotion
}>()
</script>

<template>
  <div v-if="promotion.active" class="flex flex-wrap items-center gap-2 mb-4">
    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
      {{ promotion.tag }}
    </span>
    <span
      v-if="promotion.discountLabel"
      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600 border border-orange-200"
    >
      {{ promotion.discountLabel }}
    </span>
    <span
      v-if="promotion.originalPrice"
      class="text-gray-400 line-through text-lg"
    >
      ¥{{ promotion.originalPrice.toFixed(2) }}
    </span>
  </div>
</template>
