import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = []

function processQueue(error: unknown | null, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      isRefreshing = false
      processQueue(null, null)
      router.push({ name: 'login', query: { redirect: window.location.pathname } })
      
      return Promise.reject(error)
    }

    if (error.response?.status === 403) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({ name: 'login' })
    }

    if (error.response?.status === 500) {
      ElMessage.error('服务器错误，请稍后重试')
    }

    const errorMessage = error.response?.data?.message || error.message || '请求失败'
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      ElMessage.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

const request = {
  get: <T>(url: string, config?: object): Promise<T> => instance.get(url, config) as Promise<T>,
  post: <T>(url: string, data?: object, config?: object): Promise<T> => instance.post(url, data, config) as Promise<T>,
  put: <T>(url: string, data?: object, config?: object): Promise<T> => instance.put(url, data, config) as Promise<T>,
  delete: <T>(url: string, config?: object): Promise<T> => instance.delete(url, config) as Promise<T>
}

export default request