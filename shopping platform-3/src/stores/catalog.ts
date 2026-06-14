import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '../types'
import { getCategories } from '../api/products'

export const useCatalogStore = defineStore('catalog', () => {
  const categories = ref<Category[]>([])
  const loaded = ref(false)
  let loadingPromise: Promise<Category[]> | null = null

  async function fetchCategories(force = false) {
    if (loaded.value && !force) {
      return categories.value
    }

    if (loadingPromise && !force) {
      return loadingPromise
    }

    loadingPromise = getCategories().then(result => {
      categories.value = result
      loaded.value = true
      loadingPromise = null
      return result
    })

    return loadingPromise
  }

  return {
    categories,
    loaded,
    fetchCategories
  }
})
