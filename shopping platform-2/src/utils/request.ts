import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import { findMockHandler } from '../mock/handler'
import { getApiErrorMessage, isAuthApiUrl } from './apiError'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.MODE === 'development'

export const MOCK_BASE_URL = '/api'

let requestCount = 0
function logMock(method: string, url: string, params?: Record<string, unknown>) {
  requestCount += 1
  const qs = params && Object.keys(params).length
    ? '?' + new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        )
      ).toString()
    : ''
  console.info(`[Mock][#${requestCount}] ${method} ${url}${qs}`)
}

const instance: AxiosInstance = axios.create({
  baseURL: MOCK_BASE_URL,
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
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isAuthApiUrl(originalRequest?.url)) {
        ElMessage.error(getApiErrorMessage(error, '用户名或密码错误'))
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        }).catch(err => Promise.reject(err))
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
      return Promise.reject(error)
    }

    const status = error.response?.status
    if (status !== 401 && status !== 403) {
      if (status === 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else if (error.response) {
        const errorMessage = error.response.data?.message || '请求失败'
        ElMessage.error(errorMessage)
      } else {
        ElMessage.error('网络异常，请检查后端服务是否已启动')
      }
    }

    return Promise.reject(error)
  }
)

function stripBase(url: string, base?: string): string {
  if (!base) return url
  if (url.startsWith(base)) return url.slice(base.length)
  return url
}

function buildQueryString(params: Record<string, unknown> | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  if (!params) return result
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') result[k] = v
  })
  return result
}

async function mockAdapter<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  config?: AxiosRequestConfig,
  data?: unknown
): Promise<T> {
  const path = stripBase(url, instance.defaults.baseURL)
  const handler = findMockHandler(method, path)
  if (!handler) {
    const token = localStorage.getItem('token')
    if (USE_MOCK || (token && token.startsWith('mock.'))) {
      const err = new Error(`Mock 未实现: ${method} ${path}`) as Error & { code?: number }
      err.code = 501
      console.warn(`[Mock] 未注册路由 ${method} ${path}，已阻止回退到真实后端`)
      throw err
    }
    return instance.request({ url, method, data, ...(config || {}) }) as Promise<T>
  }

  const params = (config?.params as Record<string, unknown>) || {}
  const query = buildQueryString(params)
  logMock(method, url, query)

  const result = await handler.handle(query, data, path)

  if (!result.success) {
    const err = new Error(result.message || 'Mock 请求失败') as Error & { code?: number }
    err.code = result.code
    ElMessage.error(result.message || '请求失败')
    throw err
  }

  return result.data as T
}

const request = {
  get: <T>(url: string, config?: { params?: Record<string, unknown> }): Promise<T> => {
    if (USE_MOCK) return mockAdapter<T>('GET', url, config)
    return instance.get(url, config) as Promise<T>
  },
  post: <T>(url: string, data?: unknown, config?: object): Promise<T> => {
    if (USE_MOCK) return mockAdapter<T>('POST', url, config, data)
    return instance.post(url, data, config) as Promise<T>
  },
  put: <T>(url: string, data?: unknown, config?: object): Promise<T> => {
    if (USE_MOCK) return mockAdapter<T>('PUT', url, config, data)
    return instance.put(url, data, config) as Promise<T>
  },
  delete: <T>(url: string, config?: object): Promise<T> => {
    if (USE_MOCK) return mockAdapter<T>('DELETE', url, config)
    return instance.delete(url, config) as Promise<T>
  }
}

export default request
