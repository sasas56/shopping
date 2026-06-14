<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ProductPromotion } from '../types'

const props = defineProps<{
  promotion: ProductPromotion
}>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const remaining = computed(() => {
  const diff = new Date(props.promotion.endTime).getTime() - now.value
  return Math.max(0, diff)
})

const expired = computed(() => remaining.value <= 0)

const timeParts = computed(() => {
  const total = Math.floor(remaining.value / 1000)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div
    v-if="promotion.active"
    class="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100"
  >
    <span class="text-sm font-medium text-red-600 shrink-0">距结束</span>
    <div v-if="!expired" class="flex items-center gap-1 font-mono text-lg font-bold text-red-500">
      <span class="countdown-block">{{ timeParts.hours }}</span>
      <span class="text-red-400">:</span>
      <span class="countdown-block">{{ timeParts.minutes }}</span>
      <span class="text-red-400">:</span>
      <span class="countdown-block">{{ timeParts.seconds }}</span>
    </div>
    <span v-else class="text-sm text-gray-500">活动已结束</span>
  </div>
</template>

<style scoped>
.countdown-block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  padding: 0.125rem 0.375rem;
  background: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}
</style>
