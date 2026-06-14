import type { Product, Category, Review, CartItem, WishlistItem, Address, Order, OrderItem } from '../types'

const categories: Category[] = [
  { id: 1, name: '家居日用品', parentId: null, sortOrder: 1 },
  { id: 2, name: '休闲零食', parentId: null, sortOrder: 2 },
  { id: 3, name: '美妆护肤', parentId: null, sortOrder: 3 },
  { id: 4, name: '数码配件', parentId: null, sortOrder: 4 },
  { id: 5, name: '服饰鞋包', parentId: null, sortOrder: 5 }
]

type RawProduct = Omit<Product, 'id' | 'createdAt'> & {
  createdAt?: string
  id?: number
}

const rawProducts: RawProduct[] = [
  { name: '维达抽纸（24包/箱）', price: 29.9, stock: 500, description: '原生木浆、湿水不易破，家用刚需', image: '/images/维达抽纸24包.png', categoryId: 1, sales: 12345, rating: 4.8 },
  { name: '一次性洗脸巾（3卷）', price: 19.9, stock: 800, description: '纯棉加厚、卸妆洁面两用，网红爆款', image: '/images/一次性洗脸巾.jpg', categoryId: 1, sales: 9876, rating: 4.9 },
  { name: '加厚垃圾袋（100只装）', price: 8.9, stock: 1000, description: '加厚承重、断点设计，厨房必备', image: '/images/加厚垃圾袋.jpg', categoryId: 1, sales: 15678, rating: 4.6 },
  { name: '超能洗衣液（5kg）', price: 39.9, stock: 300, description: '天然椰油、低泡易漂，家庭大包装', image: '/images/超能洗衣液.jpg', categoryId: 1, sales: 8765, rating: 4.7 },
  { name: '洁柔湿厕纸（40抽×3包）', price: 24.9, stock: 600, description: '可冲散、抑菌保湿，卫生升级', image: '/images/洁柔湿厕纸.jpg', categoryId: 1, sales: 6543, rating: 4.8 },
  { name: '无痕衣架（20个）', price: 16.9, stock: 400, description: '防滑宽肩、节省空间，衣柜整理神器', image: '/images/无痕衣架.jpg', categoryId: 1, sales: 7890, rating: 4.5 },
  { name: '居家拖鞋（男女同款）', price: 12.9, stock: 900, description: '柔软防滑，四季居家通用', image: '/images/居家拖鞋.jpg', categoryId: 1, sales: 5432, rating: 4.6 },
  { name: '厨房纸巾（8卷装）', price: 18.8, stock: 700, description: '强吸油、耐水洗，厨房清洁利器', image: '/images/厨房纸巾.jpg', categoryId: 1, sales: 4521, rating: 4.7 },
  { name: '比比赞小麻花（500g）', price: 6.9, stock: 800, description: '独立包装、多种口味，解馋小零食', image: '/images/比比赞小麻花.jpg', categoryId: 2, sales: 23456, rating: 4.6 },
  { name: '洽洽香瓜子（30小包）', price: 7.9, stock: 600, description: '焦糖/五香混合，追剧必备', image: '/images/洽洽香瓜子.jpg', categoryId: 2, sales: 18901, rating: 4.7 },
  { name: '良品铺子Q弹豆干（320g）', price: 19.9, stock: 500, description: '麻辣/五香，高蛋白素食', image: '/images/良品铺子Q弹豆干.jpg', categoryId: 2, sales: 12345, rating: 4.8 },
  { name: '慕大姐小鱼仔（20包）', price: 9.9, stock: 700, description: '香辣入味、即食开胃', image: '/images/慕大姐小鱼仔.jpg', categoryId: 2, sales: 15678, rating: 4.6 },
  { name: '百草味芒果干（120g×2袋）', price: 25.9, stock: 400, description: '果肉厚实、酸甜不腻，果干爆款', image: '/images/百草味芒果干.jpg', categoryId: 2, sales: 11234, rating: 4.9 },
  { name: '三只松鼠坚果大礼包', price: 89.0, stock: 200, description: '多种坚果组合，节日送礼首选', image: '/images/三只松鼠坚果大礼包.jpg', categoryId: 2, sales: 9876, rating: 4.8 },
  { name: '卫龙大面筋辣条', price: 5.9, stock: 1000, description: '经典童年味道，麻辣鲜香', image: '/images/卫龙大面筋辣条.png', categoryId: 2, sales: 27890, rating: 4.5 },
  { name: '良品铺子每日坚果', price: 49.9, stock: 300, description: '30小包独立包装，营养美味', image: '/images/良品铺子每日坚果.jpg', categoryId: 2, sales: 8765, rating: 4.7 },
  { name: '珂润润浸保湿面霜（40g）', price: 125, stock: 200, description: '敏感肌适用、补水修护', image: '/images/珂润润浸保湿面霜.avif', categoryId: 3, sales: 5678, rating: 4.9 },
  { name: '美宝莲眼唇卸妆液（150ml）', price: 29.9, stock: 350, description: '温和不刺激、快速卸除防水妆', image: '/images/美宝莲眼唇卸妆液.jpg', categoryId: 3, sales: 7890, rating: 4.7 },
  { name: '自然堂冰肌水（160ml）', price: 89, stock: 250, description: '补水保湿、提亮肤色，国货经典', image: '/images/自然堂冰肌水.jpg', categoryId: 3, sales: 6543, rating: 4.6 },
  { name: '完美日记口红礼盒', price: 199, stock: 150, description: '多色组合，持久滋润', image: '/images/完美日记口红礼盒.jpg', categoryId: 3, sales: 4321, rating: 4.8 },
  { name: '相宜本草四倍蚕丝面膜', price: 79, stock: 400, description: '蚕丝蛋白、补水提亮', image: '/images/相宜本草四倍蚕丝面膜.png', categoryId: 3, sales: 6789, rating: 4.6 },
  { name: 'AHC玻尿酸精华液', price: 158, stock: 180, description: '深层补水、锁水保湿', image: '/images/AHC 玻尿酸精华液.png', categoryId: 3, sales: 3456, rating: 4.8 },
  { name: '百雀羚帧颜修护水乳', price: 299, stock: 100, description: '抗初老套装，修护屏障', image: '/images/百雀羚帧颜修护水乳.jpg', categoryId: 3, sales: 2345, rating: 4.7 },
  { name: '橘朵眼影盘（九色）', price: 89, stock: 300, description: '大地色系，新手友好', image: '/images/橘朵九色眼影盘.jpg', categoryId: 3, sales: 5678, rating: 4.6 },
  { name: '手机透明壳（适用苹果/华为）', price: 15, stock: 1000, description: '全包防摔、高清透亮', image: '/images/手机透明壳.jpg', categoryId: 4, sales: 25678, rating: 4.5 },
  { name: '快充数据线（1米Type-C）', price: 12.9, stock: 800, description: '加粗铜线、兼容多数机型', image: '/images/快充数据线.png', categoryId: 4, sales: 19876, rating: 4.6 },
  { name: '绿联PD快充充电器', price: 59, stock: 400, description: '65W大功率，笔记本可用', image: '/images/绿联 PD 快充充电器.jpg', categoryId: 4, sales: 8765, rating: 4.8 },
  { name: '小米蓝牙耳机Air2', price: 199, stock: 200, description: '主动降噪，长续航', image: '/images/小米蓝牙耳机 Air2.jpg', categoryId: 4, sales: 6543, rating: 4.7 },
  { name: '罗技无线鼠标', price: 129, stock: 350, description: '人体工学设计，办公利器', image: '/images/罗技无线鼠标.jpg', categoryId: 4, sales: 7890, rating: 4.8 },
  { name: '金士顿U盘（128GB）', price: 49, stock: 500, description: '高速传输，防水防震', image: '/images/金士顿 U 盘 128GB.jpg', categoryId: 4, sales: 5432, rating: 4.6 },
  { name: '品胜充电宝（20000mAh）', price: 99, stock: 280, description: '大容量快充，出行必备', image: '/images/品胜 20000mAh 充电宝.jpg', categoryId: 4, sales: 6789, rating: 4.7 },
  { name: '纯棉纯色T恤（男女同款）', price: 39.9, stock: 300, description: '柔软透气、多色可选', image: '/images/纯棉纯色T恤.jpg', categoryId: 5, sales: 8765, rating: 4.7 },
  { name: '帆布托特包（大容量）', price: 29.9, stock: 200, description: '耐磨百搭、学生/通勤适用', image: '/images/帆布托特包.jpg', categoryId: 5, sales: 5678, rating: 4.8 },
  { name: '牛仔裤（直筒修身）', price: 89, stock: 250, description: '弹力面料，百搭显瘦', image: '/images/牛仔裤（直筒修身）.jpg', categoryId: 5, sales: 6543, rating: 4.6 },
  { name: '运动跑鞋（男女同款）', price: 159, stock: 180, description: '轻便缓震，舒适耐穿', image: '/images/运动跑鞋（男女同款）.jpg', categoryId: 5, sales: 4521, rating: 4.7 },
  { name: '真丝围巾（春秋款）', price: 129, stock: 120, description: '桑蚕丝面料，优雅百搭', image: '/images/真丝围巾（春秋款）.jpg', categoryId: 5, sales: 2345, rating: 4.8 },
  { name: '羊毛大衣（中长款）', price: 399, stock: 80, description: '双面羊毛，保暖大气', image: '/images/羊毛大衣（中长款）.jpg', categoryId: 5, sales: 1567, rating: 4.9 },
  { name: '家居棉服（珊瑚绒）', price: 79, stock: 300, description: '柔软保暖，居家外穿两用', image: '/images/珊瑚绒家居棉服.jpg', categoryId: 5, sales: 7890, rating: 4.6 },
  { name: '真皮钱包（男士）', price: 259, stock: 150, description: '头层牛皮，多卡位设计', image: '/images/男士真皮钱包.jpg', categoryId: 5, sales: 3456, rating: 4.7 },
  { name: '保温饭盒（三层）', price: 69, stock: 400, description: '304不锈钢，便携保温', image: '/images/保温饭盒（三层）.jpg', categoryId: 1, sales: 5678, rating: 4.6 },
  { name: '陶瓷餐具套装（16头）', price: 199, stock: 150, description: '骨瓷材质，精美礼盒装', image: '/images/陶瓷餐具套装（16 头）.jpg', categoryId: 1, sales: 2345, rating: 4.8 },
  { name: '智能扫地机器人', price: 1299, stock: 50, description: '激光导航，自动回充', image: '/images/智能扫地机器人.jpg', categoryId: 1, sales: 890, rating: 4.9 },
  { name: '空气炸锅（5L）', price: 299, stock: 120, description: '无油烹饪，健康美味', image: '/images/空气炸锅（5L）.jpg', categoryId: 1, sales: 6789, rating: 4.7 },
  { name: '每日坚果零食桶', price: 69.9, stock: 350, description: '混合坚果，营养健康', image: '/images/每日坚果零食桶.png', categoryId: 2, sales: 4567, rating: 4.6 },
  { name: '黑糖姜茶（20包）', price: 29.9, stock: 500, description: '暖宫驱寒，女性必备', image: '/images/黑糖姜茶（20 包）.jpg', categoryId: 2, sales: 5432, rating: 4.7 },
  { name: '云南白药牙膏套装', price: 49, stock: 600, description: '留兰薄荷，清新口气', image: '/images/云南白药牙膏套装.png', categoryId: 1, sales: 12345, rating: 4.8 },
  { name: '维达卷纸（10卷）', price: 32.9, stock: 800, description: '四层加厚，柔软亲肤', image: '/images/维达卷纸（10 卷）.jpg', categoryId: 1, sales: 15678, rating: 4.7 },
  { name: '三只松鼠牛肉干', price: 59.9, stock: 400, description: '内蒙古牛肉，原味/麻辣', image: '/images/三只松鼠牛肉干.jpg', categoryId: 2, sales: 8765, rating: 4.8 },
  { name: '良品铺子阿胶糕', price: 159, stock: 200, description: '滋补养颜，女士首选', image: '/images/良品铺子阿胶糕.jpg', categoryId: 3, sales: 3456, rating: 4.7 },
  { name: '飞利浦电动牙刷', price: 249, stock: 180, description: '声波震动，深层清洁', image: '/images/飞利浦电动牙刷.jpg', categoryId: 4, sales: 5678, rating: 4.8 },
  { name: '南极人四件套（1.8m床）', price: 129, stock: 220, description: '全棉面料，亲肤透气', image: '/images/南极人四件套（1.8m 床）.jpg', categoryId: 1, sales: 6789, rating: 4.7 },
  { name: '得力中性笔（12支）', price: 12.9, stock: 1200, description: '书写流畅，办公学习', image: '/images/得力中性笔（12 支装）.jpg', categoryId: 4, sales: 18901, rating: 4.6 },
  { name: '乐事薯片大礼包', price: 39.9, stock: 600, description: '多口味组合，休闲必备', image: '/images/乐事薯片大礼包.jpg', categoryId: 2, sales: 9876, rating: 4.6 },
  { name: '高洁丝卫生巾礼盒', price: 89, stock: 400, description: '日夜组合，舒适透气', image: '/images/高洁丝卫生巾礼盒.jpg', categoryId: 3, sales: 5432, rating: 4.7 }
]

const products: Product[] = rawProducts.map((p, idx) => ({
  ...p,
  id: idx + 1,
  createdAt: p.createdAt || new Date(Date.now() - idx * 86400000).toISOString()
}))

function delay<T>(data: T, min = 150, max = 450): Promise<T> {
  const ms = Math.floor(Math.random() * (max - min)) + min
  return new Promise(resolve => setTimeout(() => resolve(data), ms))
}

export interface ApiResult<T> {
  code: number
  data: T
  message: string
  success: boolean
}

export interface ProductListQuery {
  page?: number
  size?: number
  categoryId?: number | string
  keyword?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function mockFetchProducts(query: ProductListQuery = {}): Promise<ApiResult<{
  items: Product[]
  total: number
  page: number
  size: number
}>> {
  const page = Number(query.page) || 1
  const size = Number(query.size) || 10
  const sortBy = query.sortBy || 'createdAt'
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc'

  let list = [...products]

  if (query.categoryId !== undefined && query.categoryId !== '' && query.categoryId !== null) {
    const cid = Number(query.categoryId)
    if (!Number.isNaN(cid)) {
      list = list.filter(p => p.categoryId === cid)
    }
  }

  if (query.keyword) {
    const kw = String(query.keyword).trim().toLowerCase()
    if (kw) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw)
      )
    }
  }

  list.sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortBy]
    const bv = (b as unknown as Record<string, unknown>)[sortBy]
    if (av === bv) return 0
    const cmp = av! > bv! ? 1 : -1
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const total = list.length
  const start = (page - 1) * size
  const items = list.slice(start, start + size)

  return delay({
    code: 0,
    data: { items, total, page, size },
    message: 'ok',
    success: true
  })
}

export function mockFetchProduct(id: number): Promise<ApiResult<Product>> {
  const p = products.find(x => x.id === id)
  if (!p) {
    return delay({ code: 404, data: null as unknown as Product, message: '商品不存在', success: false })
  }
  return delay({ code: 0, data: p, message: 'ok', success: true })
}

export function mockFetchCategories(): Promise<ApiResult<Category[]>> {
  return delay({ code: 0, data: categories, message: 'ok', success: true })
}

export function mockFetchProductReviews(productId: number, query: { page?: number; size?: number } = {}): Promise<ApiResult<{
  items: Review[]
  total: number
  page: number
  size: number
}>> {
  const page = Number(query.page) || 1
  const size = Number(query.size) || 10
  const all: Review[] = []
  for (let i = 1; i <= 12; i++) {
    all.push({
      id: i,
      productId,
      userId: i,
      username: `用户${i}`,
      rating: 4 + (i % 2),
      content: '质量很好，物流很快，值得购买！',
      createdAt: new Date(Date.now() - i * 3600000).toISOString()
    })
  }
  const start = (page - 1) * size
  return delay({
    code: 0,
    data: { items: all.slice(start, start + size), total: all.length, page, size },
    message: 'ok',
    success: true
  })
}

// ── 用户认证 Mock（localStorage 持久化，无需启动后端即可登录） ──

type MockUserRecord = {
  id: number
  username: string
  password: string
  email: string
  phone: string
  createdAt: string
}

const USERS_STORAGE_KEY = 'shopping_mock_users'

const DEFAULT_USERS: MockUserRecord[] = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    phone: '13800138000',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

function loadUsers(): MockUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      saveUsers(DEFAULT_USERS)
      return [...DEFAULT_USERS]
    }
    const list = JSON.parse(raw) as MockUserRecord[]
    if (!list.some(u => u.username === 'admin')) {
      list.unshift(...DEFAULT_USERS)
      saveUsers(list)
    }
    return list
  } catch {
    saveUsers(DEFAULT_USERS)
    return [...DEFAULT_USERS]
  }
}

function saveUsers(list: MockUserRecord[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list))
}

function nextUserId(list: MockUserRecord[]) {
  return list.reduce((max, u) => Math.max(max, u.id), 0) + 1
}

function createMockToken(userId: number, username: string): string {
  const payload = btoa(JSON.stringify({ userId, username, mock: true }))
  return `mock.${payload}.token`
}

function toPublicUser(user: MockUserRecord) {
  const { password: _password, ...publicUser } = user
  return publicUser
}

export function mockLogin(body: {
  username?: string
  password?: string
}): Promise<ApiResult<{ token: string; user: ReturnType<typeof toPublicUser> }>> {
  const username = String(body.username || '').trim()
  const password = String(body.password || '')
  if (!username || !password) return fail(400, '请输入用户名和密码')

  const user = loadUsers().find(u => u.username === username && u.password === password)
  if (!user) return fail(401, '用户名或密码错误')

  return delay({
    code: 0,
    data: { token: createMockToken(user.id, user.username), user: toPublicUser(user) },
    message: 'ok',
    success: true
  })
}

function parseMockToken(): { userId: number; username: string } | null {
  try {
    const token = localStorage.getItem('token')
    if (!token || !token.startsWith('mock.')) return null
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload)) as { userId: number; username: string }
  } catch {
    return null
  }
}

function resolveCurrentMockUser(): MockUserRecord | null {
  const parsed = parseMockToken()
  if (parsed) {
    const user = loadUsers().find(u => u.id === parsed.userId)
    if (user) return user
  }
  try {
    const stored = localStorage.getItem('user')
    if (stored) {
      const publicUser = JSON.parse(stored) as ReturnType<typeof toPublicUser>
      return loadUsers().find(u => u.id === publicUser.id) || null
    }
  } catch {
    return null
  }
  return null
}

export function mockGetUserInfo(): Promise<ApiResult<ReturnType<typeof toPublicUser>>> {
  const user = resolveCurrentMockUser()
  if (!user) return fail(401, '未登录或登录已过期')
  return delay({ code: 0, data: toPublicUser(user), message: 'ok', success: true })
}

export function mockUpdateUserInfo(body: {
  email?: string
  phone?: string
}): Promise<ApiResult<ReturnType<typeof toPublicUser>>> {
  const user = resolveCurrentMockUser()
  if (!user) return fail(401, '未登录或登录已过期')

  const list = loadUsers()
  const index = list.findIndex(u => u.id === user.id)
  if (index === -1) return fail(404, '用户不存在')

  if (body.email !== undefined) list[index].email = String(body.email)
  if (body.phone !== undefined) list[index].phone = String(body.phone)
  saveUsers(list)

  const updated = toPublicUser(list[index])
  localStorage.setItem('user', JSON.stringify(updated))
  return delay({ code: 0, data: updated, message: 'ok', success: true })
}

export function mockRegister(body: {
  username?: string
  password?: string
  email?: string
  phone?: string
}): Promise<ApiResult<{ message: string }>> {
  const username = String(body.username || '').trim()
  const password = String(body.password || '')
  const email = String(body.email || '').trim()
  if (!username || !password) return fail(400, '请输入用户名和密码')
  if (!email) return fail(400, '请输入邮箱')

  const list = loadUsers()
  if (list.some(u => u.username === username)) return fail(400, '用户名已存在')

  list.push({
    id: nextUserId(list),
    username,
    password,
    email,
    phone: String(body.phone || ''),
    createdAt: new Date().toISOString()
  })
  saveUsers(list)
  return delay({ code: 0, data: { message: 'User registered successfully' }, message: 'ok', success: true })
}

// ── 购物车 / 收藏 Mock（开发环境无需启动后端） ──

const mockCarts: Array<{ id: number; userId: number; productId: number; quantity: number }> = []
const mockWishlists: Array<{ id: number; userId: number; productId: number; createdAt: string }> = []
let nextCartId = 1
let nextWishlistId = 1
const MOCK_USER_ID = 1

function findProduct(id: number) {
  return products.find(p => p.id === id)
}

function fail(code: number, message: string): Promise<ApiResult<never>> {
  return delay({ code, data: null as never, message, success: false })
}

export function mockFetchCart(): Promise<ApiResult<CartItem[]>> {
  const items = mockCarts
    .filter(c => c.userId === MOCK_USER_ID)
    .map(c => ({ ...c, product: findProduct(c.productId) }))
    .filter(c => c.product) as CartItem[]
  return delay({ code: 0, data: items, message: 'ok', success: true })
}

export function mockAddToCart(body: { productId?: number; quantity?: number }): Promise<ApiResult<CartItem>> {
  const productId = Number(body?.productId)
  const quantity = Number(body?.quantity) || 1
  const product = findProduct(productId)
  if (!product) return fail(404, '商品不存在')
  const existing = mockCarts.find(c => c.userId === MOCK_USER_ID && c.productId === productId)
  if (existing) {
    existing.quantity += quantity
    return delay({ code: 0, data: { ...existing, product }, message: 'ok', success: true })
  }
  const item = { id: nextCartId++, userId: MOCK_USER_ID, productId, quantity }
  mockCarts.push(item)
  return delay({ code: 0, data: { ...item, product }, message: 'ok', success: true })
}

export function mockUpdateCartItem(id: number, body: { quantity?: number }): Promise<ApiResult<CartItem>> {
  const item = mockCarts.find(c => c.id === id && c.userId === MOCK_USER_ID)
  if (!item) return fail(404, '购物车商品不存在')
  item.quantity = Number(body?.quantity) || 1
  const product = findProduct(item.productId)
  return delay({ code: 0, data: { ...item, product }, message: 'ok', success: true })
}

export function mockDeleteCartItem(id: number): Promise<ApiResult<{ message: string }>> {
  const index = mockCarts.findIndex(c => c.id === id && c.userId === MOCK_USER_ID)
  if (index === -1) return fail(404, '购物车商品不存在')
  mockCarts.splice(index, 1)
  return delay({ code: 0, data: { message: 'deleted' }, message: 'ok', success: true })
}

export function mockClearCart(): Promise<ApiResult<{ message: string }>> {
  for (let i = mockCarts.length - 1; i >= 0; i--) {
    if (mockCarts[i].userId === MOCK_USER_ID) mockCarts.splice(i, 1)
  }
  return delay({ code: 0, data: { message: 'cleared' }, message: 'ok', success: true })
}

export function mockFetchWishlist(): Promise<ApiResult<WishlistItem[]>> {
  const items = mockWishlists
    .filter(w => w.userId === MOCK_USER_ID)
    .map(w => ({ ...w, product: findProduct(w.productId) }))
    .filter(w => w.product) as WishlistItem[]
  return delay({ code: 0, data: items, message: 'ok', success: true })
}

export function mockFetchWishlistIds(): Promise<ApiResult<number[]>> {
  const ids = mockWishlists.filter(w => w.userId === MOCK_USER_ID).map(w => w.productId)
  return delay({ code: 0, data: ids, message: 'ok', success: true })
}

export function mockAddToWishlist(body: { productId?: number }): Promise<ApiResult<WishlistItem>> {
  const productId = Number(body?.productId)
  const product = findProduct(productId)
  if (!product) return fail(404, '商品不存在')
  const existing = mockWishlists.find(w => w.userId === MOCK_USER_ID && w.productId === productId)
  if (existing) {
    return delay({ code: 0, data: { ...existing, product }, message: 'ok', success: true })
  }
  const item = { id: nextWishlistId++, userId: MOCK_USER_ID, productId, createdAt: new Date().toISOString() }
  mockWishlists.push(item)
  return delay({ code: 0, data: { ...item, product }, message: 'ok', success: true })
}

export function mockRemoveFromWishlist(productId: number): Promise<ApiResult<{ message: string }>> {
  const index = mockWishlists.findIndex(w => w.userId === MOCK_USER_ID && w.productId === productId)
  if (index === -1) return fail(404, '收藏不存在')
  mockWishlists.splice(index, 1)
  return delay({ code: 0, data: { message: 'removed' }, message: 'ok', success: true })
}

// ── 收货地址 Mock（localStorage 持久化，刷新/重启后保留） ──

const ADDRESS_STORAGE_KEY = 'shopping_mock_addresses'

function loadStoredAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Address[]
  } catch {
    return []
  }
}

function saveStoredAddresses(list: Address[]) {
  localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(list))
}

function nextAddressId(list: Address[]) {
  return list.reduce((max, a) => Math.max(max, a.id), 0) + 1
}

function ensureDefaultAddress(list: Address[], addressId: number, isDefault: boolean) {
  if (!isDefault) return
  list.forEach(a => {
    if (a.userId === MOCK_USER_ID && a.id !== addressId) a.isDefault = false
  })
}

export function mockFetchAddresses(): Promise<ApiResult<Address[]>> {
  const list = loadStoredAddresses().filter(a => a.userId === MOCK_USER_ID)
  return delay({ code: 0, data: list, message: 'ok', success: true })
}

export function mockAddAddress(body: Partial<Address>): Promise<ApiResult<Address>> {
  const list = loadStoredAddresses()
  const item: Address = {
    id: nextAddressId(list),
    userId: MOCK_USER_ID,
    receiver: String(body.receiver || ''),
    phone: String(body.phone || ''),
    province: String(body.province || ''),
    city: String(body.city || ''),
    district: String(body.district || ''),
    detail: String(body.detail || ''),
    isDefault: Boolean(body.isDefault)
  }
  list.push(item)
  ensureDefaultAddress(list, item.id, item.isDefault)
  saveStoredAddresses(list)
  return delay({ code: 0, data: item, message: 'ok', success: true })
}

export function mockUpdateAddress(id: number, body: Partial<Address>): Promise<ApiResult<Address>> {
  const list = loadStoredAddresses()
  const index = list.findIndex(a => a.id === id && a.userId === MOCK_USER_ID)
  if (index === -1) return fail(404, '地址不存在')
  list[index] = {
    ...list[index],
    receiver: body.receiver !== undefined ? String(body.receiver) : list[index].receiver,
    phone: body.phone !== undefined ? String(body.phone) : list[index].phone,
    province: body.province !== undefined ? String(body.province) : list[index].province,
    city: body.city !== undefined ? String(body.city) : list[index].city,
    district: body.district !== undefined ? String(body.district) : list[index].district,
    detail: body.detail !== undefined ? String(body.detail) : list[index].detail,
    isDefault: body.isDefault !== undefined ? Boolean(body.isDefault) : list[index].isDefault
  }
  ensureDefaultAddress(list, id, list[index].isDefault)
  saveStoredAddresses(list)
  return delay({ code: 0, data: list[index], message: 'ok', success: true })
}

export function mockDeleteAddress(id: number): Promise<ApiResult<{ message: string }>> {
  const list = loadStoredAddresses()
  const index = list.findIndex(a => a.id === id && a.userId === MOCK_USER_ID)
  if (index === -1) return fail(404, '地址不存在')
  list.splice(index, 1)
  saveStoredAddresses(list)
  return delay({ code: 0, data: { message: 'deleted' }, message: 'ok', success: true })
}

// ── 订单 Mock（localStorage 持久化） ──

const ORDER_STORAGE_KEY = 'shopping_mock_orders'

type StoredOrder = Order & { items: OrderItem[] }

function loadStoredOrders(): StoredOrder[] {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as StoredOrder[]
  } catch {
    return []
  }
}

function saveStoredOrders(list: StoredOrder[]) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(list))
}

function nextOrderId(list: StoredOrder[]) {
  return list.reduce((max, o) => Math.max(max, o.id), 0) + 1
}

let nextOrderItemId = 1

function enrichOrder(order: StoredOrder): StoredOrder {
  return {
    ...order,
    address: loadStoredAddresses().find(a => a.id === order.addressId),
    items: order.items.map(item => ({
      ...item,
      product: findProduct(item.productId)
    }))
  }
}

export function mockFetchOrders(query: {
  page?: number
  size?: number
  status?: string
} = {}): Promise<ApiResult<{ items: StoredOrder[]; total: number; page: number; size: number }>> {
  const page = Number(query.page) || 1
  const size = Number(query.size) || 10
  let list = loadStoredOrders()
    .filter(o => o.userId === MOCK_USER_ID)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (query.status) {
    list = list.filter(o => o.status === query.status)
  }

  const total = list.length
  const start = (page - 1) * size
  const items = list.slice(start, start + size).map(enrichOrder)

  return delay({ code: 0, data: { items, total, page, size }, message: 'ok', success: true })
}

export function mockFetchOrder(id: number): Promise<ApiResult<StoredOrder>> {
  const order = loadStoredOrders().find(o => o.id === id && o.userId === MOCK_USER_ID)
  if (!order) return fail(404, '订单不存在')
  return delay({ code: 0, data: enrichOrder(order), message: 'ok', success: true })
}

export function mockCreateOrder(body: { addressId?: number }): Promise<ApiResult<StoredOrder>> {
  const addressId = Number(body?.addressId)
  const address = loadStoredAddresses().find(a => a.id === addressId && a.userId === MOCK_USER_ID)
  if (!address) return fail(400, '收货地址无效')

  const userCart = mockCarts.filter(c => c.userId === MOCK_USER_ID)
  if (userCart.length === 0) return fail(400, '购物车为空')

  for (const item of userCart) {
    const product = findProduct(item.productId)
    if (!product) return fail(400, `商品 ${item.productId} 不存在`)
    if (product.stock < item.quantity) {
      return fail(400, `${product.name} 库存不足，当前库存 ${product.stock} 件`)
    }
  }

  const orders = loadStoredOrders()
  const orderId = nextOrderId(orders)
  const orderItems: OrderItem[] = userCart.map(item => {
    const product = findProduct(item.productId)!
    return {
      id: nextOrderItemId++,
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: product.price
    }
  })

  for (const item of userCart) {
    const product = findProduct(item.productId)!
    product.stock -= item.quantity
    product.sales += item.quantity
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const newOrder: StoredOrder = {
    id: orderId,
    userId: MOCK_USER_ID,
    addressId,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString(),
    payTime: null,
    shipTime: null,
    completeTime: null,
    items: orderItems
  }

  orders.push(newOrder)
  saveStoredOrders(orders)

  for (let i = mockCarts.length - 1; i >= 0; i--) {
    if (mockCarts[i].userId === MOCK_USER_ID) mockCarts.splice(i, 1)
  }

  return delay({ code: 0, data: enrichOrder(newOrder), message: 'ok', success: true })
}

function findStoredOrder(id: number): StoredOrder | undefined {
  return loadStoredOrders().find(o => o.id === id && o.userId === MOCK_USER_ID)
}

function updateStoredOrder(order: StoredOrder) {
  const orders = loadStoredOrders()
  const index = orders.findIndex(o => o.id === order.id)
  if (index !== -1) {
    orders[index] = order
    saveStoredOrders(orders)
  }
}

export function mockCancelOrder(id: number): Promise<ApiResult<StoredOrder>> {
  const order = findStoredOrder(id)
  if (!order) return fail(404, '订单不存在')
  if (order.status !== 'pending') return fail(400, '当前订单状态无法取消')

  for (const item of order.items) {
    const product = findProduct(item.productId)
    if (product) {
      product.stock += item.quantity
      product.sales -= item.quantity
    }
  }

  order.status = 'cancelled'
  updateStoredOrder(order)
  return delay({ code: 0, data: enrichOrder(order), message: 'ok', success: true })
}

export function mockPayOrder(id: number): Promise<ApiResult<StoredOrder>> {
  const order = findStoredOrder(id)
  if (!order) return fail(404, '订单不存在')
  if (order.status !== 'pending') return fail(400, '订单不是待支付状态')

  order.status = 'paid'
  order.payTime = new Date().toISOString()
  updateStoredOrder(order)

  setTimeout(() => {
    const current = findStoredOrder(id)
    if (current && current.status === 'paid') {
      current.status = 'shipped'
      current.shipTime = new Date().toISOString()
      updateStoredOrder(current)
    }
  }, 1000)

  return delay({ code: 0, data: enrichOrder(order), message: 'ok', success: true })
}

export function mockCompleteOrder(id: number): Promise<ApiResult<StoredOrder>> {
  const order = findStoredOrder(id)
  if (!order) return fail(404, '订单不存在')
  if (order.status !== 'shipped') return fail(400, '订单尚未发货')

  order.status = 'completed'
  order.completeTime = new Date().toISOString()
  updateStoredOrder(order)
  return delay({ code: 0, data: enrichOrder(order), message: 'ok', success: true })
}
