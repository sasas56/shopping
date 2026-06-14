<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { getApiErrorMessage } from '../utils/apiError'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const phone = ref('')

async function handleRegister() {
  if (!username.value.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!password.value.trim()) {
    ElMessage.warning('请输入密码')
    return
  }
  if (password.value !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  if (!email.value.trim()) {
    ElMessage.warning('请输入邮箱')
    return
  }
  
  try {
    await userStore.register(username.value, password.value, confirmPassword.value, email.value, phone.value)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error(getApiErrorMessage(error, '注册失败'))
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">用户注册</h2>
        <p class="text-gray-500 mt-2">创建您的账户</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-gray-600 mb-2">用户名</label>
          <input 
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-gray-600 mb-2">密码</label>
          <input 
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-gray-600 mb-2">确认密码</label>
          <input 
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-gray-600 mb-2">邮箱</label>
          <input 
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-gray-600 mb-2">手机号（选填）</label>
          <input 
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <button 
          type="submit"
          class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium mt-6"
        >
          注册
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <span class="text-gray-500">已有账号？</span>
        <button 
          class="text-primary hover:text-primary/80 ml-2"
          @click="router.push('/login')"
        >
          立即登录
        </button>
      </div>
    </div>
  </div>
</template>