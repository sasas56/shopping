<script setup lang="ts">
import { ref, watch } from 'vue'
import { getProductImageUrl, getProductImageFallback } from '../utils/productImage'
import type { Product } from '../types'

const props = withDefaults(defineProps<{
  product: Pick<Product, 'id' | 'name' | 'categoryId' | 'image'>
  alt?: string
  imgClass?: string
}>(), {
  alt: '',
  imgClass: 'w-full h-full object-cover'
})

const displaySrc = ref(getProductImageUrl(props.product))

watch(
  () => props.product,
  product => {
    displaySrc.value = getProductImageUrl(product)
  },
  { deep: true }
)

function handleError() {
  displaySrc.value = getProductImageFallback(props.product)
}
</script>

<template>
  <img
    :src="displaySrc"
    :alt="alt || product.name"
    :class="imgClass"
    loading="lazy"
    @error="handleError"
  />
</template>
