<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useUserStore } from '../stores/user'
import { useWishlistStore } from '../stores/wishlist'
import type { Address } from '../types'

const router = useRouter()
const userStore = useUserStore()
const wishlistStore = useWishlistStore()

const activeTab = ref<'profile' | 'address' | 'wishlist'>('profile')

const profileForm = ref({ email: '', phone: '' })
const editingProfile = ref(false)

const addressForm = ref<Partial<Address>>({
  receiver: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const editingAddressId = ref<number | null>(null)
const showAddressForm = ref(false)

async function init() {
  if (!userStore.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  await Promise.all([
    userStore.fetchUserInfo(),
    userStore.fetchAddresses(),
    wishlistStore.fetchWishlist()
  ])
  if (userStore.user) {
    profileForm.value = {
      email: userStore.user.email,
      phone: userStore.user.phone
    }
  }
}

async function saveProfile() {
  try {
    await userStore.updateProfile(profileForm.value)
    editingProfile.value = false
    ElMessage.success('个人信息更新成功')
  } catch {
    ElMessage.error('更新失败，请稍后重试')
  }
}

async function saveAddress() {
  if (!addressForm.value.receiver) {
    ElMessage.warning('请输入收件人姓名')
    return
  }
  if (!addressForm.value.phone) {
    ElMessage.warning('请输入联系电话')
    return
  }
  if (!addressForm.value.province) {
    ElMessage.warning('请输入省份')
    return
  }
  if (!addressForm.value.city) {
    ElMessage.warning('请输入城市')
    return
  }
  if (!addressForm.value.district) {
    ElMessage.warning('请输入区/县')
    return
  }
  if (!addressForm.value.detail) {
    ElMessage.warning('请输入详细地址')
    return
  }
  
  try {
    if (editingAddressId.value) {
      await userStore.updateExistingAddress(editingAddressId.value, addressForm.value as Omit<Address, 'id' | 'userId'>)
      ElMessage.success('地址更新成功')
    } else {
      await userStore.addNewAddress(addressForm.value as Omit<Address, 'id' | 'userId'>)
      ElMessage.success('地址添加成功')
    }
    
    await userStore.fetchAddresses()
    resetAddressForm()
  } catch {
    ElMessage.error('保存失败，请稍后重试')
  }
}

function openAddAddressForm() {
  resetAddressForm()
  showAddressForm.value = true
}

function editAddress(address: Address) {
  editingAddressId.value = address.id
  addressForm.value = { ...address }
  showAddressForm.value = true
}

async function deleteAddress(id: number) {
  await userStore.removeAddress(id)
  ElMessage.success('地址已删除')
}

async function removeWishlistItem(productId: number) {
  await wishlistStore.remove(productId)
  ElMessage.success('已取消收藏')
}

function resetAddressForm() {
  addressForm.value = {
    receiver: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  }
  editingAddressId.value = null
  showAddressForm.value = false
}

onMounted(init)
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="lg:w-48">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="font-bold">{{ userStore.user?.username }}</h3>
              <p class="text-gray-500 text-sm">{{ userStore.user?.email }}</p>
            </div>
            
            <nav class="space-y-2">
              <button 
                class="w-full text-left px-4 py-3 rounded-lg transition-colors"
                :class="{ 'bg-primary text-white': activeTab === 'profile', 'hover:bg-gray-100': activeTab !== 'profile' }"
                @click="activeTab = 'profile'"
              >
                个人信息
              </button>
              <button 
                class="w-full text-left px-4 py-3 rounded-lg transition-colors"
                :class="{ 'bg-primary text-white': activeTab === 'address', 'hover:bg-gray-100': activeTab !== 'address' }"
                @click="activeTab = 'address'"
              >
                收货地址
              </button>
              <button 
                class="w-full text-left px-4 py-3 rounded-lg transition-colors"
                :class="{ 'bg-primary text-white': activeTab === 'wishlist', 'hover:bg-gray-100': activeTab !== 'wishlist' }"
                @click="activeTab = 'wishlist'"
              >
                我的收藏
              </button>
            </nav>
          </div>
        </aside>

        <div class="lg:col-span-3">
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">个人信息</h2>
              <button 
                class="text-primary hover:text-primary/80"
                @click="editingProfile = !editingProfile"
              >
                {{ editingProfile ? '取消编辑' : '编辑资料' }}
              </button>
            </div>

            <div v-if="!editingProfile" class="space-y-4">
              <div class="flex items-center py-3 border-b">
                <span class="w-24 text-gray-500">用户名</span>
                <span class="text-gray-800">{{ userStore.user?.username }}</span>
              </div>
              <div class="flex items-center py-3 border-b">
                <span class="w-24 text-gray-500">邮箱</span>
                <span class="text-gray-800">{{ userStore.user?.email }}</span>
              </div>
              <div class="flex items-center py-3 border-b">
                <span class="w-24 text-gray-500">手机号</span>
                <span class="text-gray-800">{{ userStore.user?.phone }}</span>
              </div>
              <div class="flex items-center py-3">
                <span class="w-24 text-gray-500">注册时间</span>
                <span class="text-gray-800">{{ new Date(userStore.user?.createdAt || '').toLocaleDateString() }}</span>
              </div>
            </div>

            <div v-else class="space-y-4 max-w-md">
              <div>
                <label class="block text-gray-600 mb-1">邮箱</label>
                <input 
                  v-model="profileForm.email"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label class="block text-gray-600 mb-1">手机号</label>
                <input 
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button 
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                @click="saveProfile"
              >
                保存修改
              </button>
            </div>
          </div>

          <div v-else-if="activeTab === 'address'" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">收货地址</h2>
              <button 
                class="text-primary hover:text-primary/80"
                @click="openAddAddressForm"
              >
                + 添加地址
              </button>
            </div>

            <div v-if="!showAddressForm" class="space-y-4">
              <div 
                v-for="address in userStore.addresses" 
                :key="address.id"
                class="border rounded-lg p-4"
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
                  <div class="flex items-center space-x-2">
                    <span v-if="address.isDefault" class="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                      默认
                    </span>
                    <button 
                      class="text-gray-400 hover:text-primary"
                      @click="editAddress(address)"
                    >
                      编辑
                    </button>
                    <button 
                      class="text-gray-400 hover:text-red-500"
                      @click="deleteAddress(address.id)"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="userStore.addresses.length === 0" class="text-center py-8 text-gray-500">
                <p>暂无收货地址</p>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-600 mb-1">收件人</label>
                  <input 
                    v-model="addressForm.receiver"
                    type="text"
                    placeholder="请输入收件人姓名"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">手机号</label>
                  <input 
                    v-model="addressForm.phone"
                    type="tel"
                    placeholder="请输入手机号"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-gray-600 mb-1">省份</label>
                  <input 
                    v-model="addressForm.province"
                    type="text"
                    placeholder="省份"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">城市</label>
                  <input 
                    v-model="addressForm.city"
                    type="text"
                    placeholder="城市"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">区/县</label>
                  <input 
                    v-model="addressForm.district"
                    type="text"
                    placeholder="区/县"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-gray-600 mb-1">详细地址</label>
                <textarea 
                  v-model="addressForm.detail"
                  placeholder="请输入详细地址"
                  rows="3"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                ></textarea>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="addressForm.isDefault"
                  type="checkbox"
                  id="isDefault"
                  class="w-4 h-4 text-primary"
                />
                <label for="isDefault" class="ml-2 text-gray-600">设为默认地址</label>
              </div>
              
              <div class="flex space-x-4">
                <button 
                  class="px-6 py-2 border rounded-lg hover:bg-gray-100"
                  @click="resetAddressForm"
                >
                  取消
                </button>
                <button 
                  class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  @click="saveAddress"
                >
                  {{ editingAddressId ? '保存修改' : '添加地址' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold mb-6">我的收藏 ({{ wishlistStore.count }})</h2>
            
            <div v-if="wishlistStore.items.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="item in wishlistStore.items" 
                :key="item.id"
                class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                @click="router.push(`/products/${item.productId}`)"
              >
                <div class="aspect-square bg-gray-100">
                  <img 
                    :src="item.product?.image" 
                    :alt="item.product?.name"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-3">
                  <h4 class="text-gray-800 font-medium line-clamp-2 mb-2">{{ item.product?.name }}</h4>
                  <div class="flex items-center justify-between">
                    <span class="text-red-500 font-bold">¥{{ item.product?.price.toFixed(2) }}</span>
                    <button 
                      class="text-gray-400 hover:text-red-500 text-sm"
                      @click.stop="removeWishlistItem(item.productId)"
                    >
                      取消收藏
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-gray-500">
              <p>暂无收藏商品</p>
              <button 
                class="mt-4 text-primary hover:text-primary/80"
                @click="router.push('/products')"
              >
                去逛逛 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
