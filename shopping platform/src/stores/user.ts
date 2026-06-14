import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Address } from '../types'
import { login as loginApi, register as registerApi, getUserInfo, updateUserInfo, getAddresses, addAddress, updateAddress, deleteAddress } from '../api/users'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref(localStorage.getItem('token') || '')
  const addresses = ref<Address[]>([])

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUser(newUser: User | null) {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  async function login(username: string, password: string) {
    const result = await loginApi({ username, password })
    setToken(result.token)
    setUser(result.user)
    return result
  }

  async function register(username: string, password: string, confirmPassword: string, email: string, phone: string) {
    await registerApi({ username, password, confirmPassword, email, phone })
  }

  async function logout() {
    setToken('')
    setUser(null)
    addresses.value = []
  }

  async function fetchUserInfo() {
    if (token.value) {
      const result = await getUserInfo()
      setUser(result)
    }
  }

  async function updateProfile(data: { email?: string; phone?: string }) {
    const result = await updateUserInfo(data)
    setUser(result)
    return result
  }

  async function fetchAddresses() {
    if (token.value) {
      addresses.value = await getAddresses()
    }
  }

  async function addNewAddress(data: Omit<Address, 'id' | 'userId'>) {
    const result = await addAddress(data)
    addresses.value.push(result)
    return result
  }

  async function updateExistingAddress(id: number, data: Omit<Address, 'id' | 'userId'>) {
    await updateAddress(id, data)
    const index = addresses.value.findIndex(a => a.id === id)
    if (index !== -1) {
      addresses.value[index] = { ...addresses.value[index], ...data }
    }
  }

  async function removeAddress(id: number) {
    await deleteAddress(id)
    addresses.value = addresses.value.filter(a => a.id !== id)
  }

  return {
    user,
    token,
    addresses,
    login,
    register,
    logout,
    fetchUserInfo,
    updateProfile,
    fetchAddresses,
    addNewAddress,
    updateExistingAddress,
    removeAddress
  }
})