import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/Home.vue') },
    { path: '/products', name: 'productList', component: () => import('../views/ProductList.vue') },
    { path: '/products/:id', name: 'productDetail', component: () => import('../views/ProductDetail.vue') },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/Cart.vue'),
      meta: { requiresAuth: true, title: '购物车' }
    },
    {
      path: '/order/confirm',
      name: 'orderConfirm',
      component: () => import('../views/OrderConfirm.vue'),
      meta: { requiresAuth: true, title: '确认订单' }
    },
    {
      path: '/orders',
      name: 'orderList',
      component: () => import('../views/OrderList.vue'),
      meta: { requiresAuth: true, title: '我的订单' }
    },
    {
      path: '/orders/:id',
      name: 'orderDetail',
      component: () => import('../views/OrderDetail.vue'),
      meta: { requiresAuth: true, title: '订单详情' }
    },
    {
      path: '/user',
      name: 'userCenter',
      component: () => import('../views/UserCenter.vue'),
      meta: { requiresAuth: true, title: '个人中心' }
    },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue'), meta: { guestOnly: true } }
  ]
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    ElMessage.warning('请先登录')
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && token) {
    next({ name: 'home' })
    return
  }

  next()
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 电商购物平台`
  } else {
    document.title = '电商购物平台'
  }
})

export default router
