import request from '../utils/request'
import type { User, Address, LoginForm, RegisterForm } from '../types'

export function login(data: LoginForm) {
  return request.post<{ token: string; user: User }>('/users/login', data)
}

export function register(data: RegisterForm) {
  return request.post('/users/register', data)
}

export function getUserInfo() {
  return request.get<User>('/users/me')
}

export function updateUserInfo(data: { email?: string; phone?: string }) {
  return request.put<User>('/users/me', data)
}

export function getAddresses() {
  return request.get<Address[]>('/users/addresses')
}

export function addAddress(data: Omit<Address, 'id' | 'userId'>) {
  return request.post<Address>('/users/addresses', data)
}

export function updateAddress(id: number, data: Omit<Address, 'id' | 'userId'>) {
  return request.put(`/users/addresses/${id}`, data)
}

export function deleteAddress(id: number) {
  return request.delete(`/users/addresses/${id}`)
}