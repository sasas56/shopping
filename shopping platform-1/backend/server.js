import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const app = express()
const port = process.env.PORT || 3000
const secretKey = process.env.JWT_SECRET || 'shopping_platform_secret_key'

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

let users = [
  { id: 1, username: 'admin', password: '123456', email: 'admin@example.com', phone: '13800138000', createdAt: '2024-01-01T00:00:00.000Z' }
]

let products = [
  { id: 1, name: '维达抽纸（24包/箱）', price: 29.9, stock: 500, description: '原生木浆、湿水不易破，家用刚需', image: '/images/维达抽纸24包.png', categoryId: 1, sales: 12345, rating: 4.8, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 2, name: '一次性洗脸巾（3卷）', price: 19.9, stock: 800, description: '纯棉加厚、卸妆洁面两用，网红爆款', image: '/images/一次性洗脸巾.jpg', categoryId: 1, sales: 9876, rating: 4.9, createdAt: '2024-01-02T00:00:00.000Z' },
  { id: 3, name: '垃圾袋（100只装）', price: 8.9, stock: 1000, description: '加厚承重、断点设计，厨房必备', image: '/images/加厚垃圾袋.jpg', categoryId: 1, sales: 15678, rating: 4.6, createdAt: '2024-01-03T00:00:00.000Z' },
  { id: 4, name: '超能洗衣液（5kg）', price: 39.9, stock: 300, description: '天然椰油、低泡易漂，家庭大包装', image: '/images/超能洗衣液.jpg', categoryId: 1, sales: 8765, rating: 4.7, createdAt: '2024-01-04T00:00:00.000Z' },
  { id: 5, name: '洁柔湿厕纸（40抽×3包）', price: 24.9, stock: 600, description: '可冲散、抑菌保湿，卫生升级', image: '/images/洁柔湿厕纸.jpg', categoryId: 1, sales: 6543, rating: 4.8, createdAt: '2024-01-05T00:00:00.000Z' },
  { id: 6, name: '无痕衣架（20个）', price: 16.9, stock: 400, description: '防滑宽肩、节省空间，衣柜整理神器', image: '/images/无痕衣架.jpg', categoryId: 1, sales: 7890, rating: 4.5, createdAt: '2024-01-06T00:00:00.000Z' },
  { id: 7, name: '比比赞小麻花（500g）', price: 6.9, stock: 800, description: '独立包装、多种口味，解馋小零食', image: '/images/比比赞小麻花.jpg', categoryId: 2, sales: 23456, rating: 4.6, createdAt: '2024-01-07T00:00:00.000Z' },
  { id: 8, name: '洽洽香瓜子（30小包）', price: 7.9, stock: 600, description: '焦糖/五香混合，追剧必备', image: '/images/洽洽香瓜子.jpg', categoryId: 2, sales: 18901, rating: 4.7, createdAt: '2024-01-08T00:00:00.000Z' },
  { id: 9, name: '良品铺子Q弹豆干（320g）', price: 19.9, stock: 500, description: '麻辣/五香，高蛋白素食', image: '/images/良品铺子Q弹豆干.jpg', categoryId: 2, sales: 12345, rating: 4.8, createdAt: '2024-01-09T00:00:00.000Z' },
  { id: 10, name: '慕大姐小鱼仔（20包）', price: 9.9, stock: 700, description: '香辣入味、即食开胃', image: '/images/慕大姐小鱼仔.jpg', categoryId: 2, sales: 15678, rating: 4.6, createdAt: '2024-01-10T00:00:00.000Z' },
  { id: 11, name: '百草味芒果干（120g×2袋）', price: 25.9, stock: 400, description: '果肉厚实、酸甜不腻，果干爆款', image: '/images/百草味芒果干.jpg', categoryId: 2, sales: 11234, rating: 4.9, createdAt: '2024-01-11T00:00:00.000Z' },
  { id: 12, name: '珂润润浸保湿面霜（40g）', price: 125, stock: 200, description: '敏感肌适用、补水修护，平价贵妇霜', image: '/images/珂润润浸保湿面霜.avif', categoryId: 3, sales: 5678, rating: 4.9, createdAt: '2024-01-12T00:00:00.000Z' },
  { id: 13, name: '美宝莲眼唇卸妆液（150ml）', price: 29.9, stock: 350, description: '温和不刺激、快速卸除防水妆', image: '/images/美宝莲眼唇卸妆液.jpg', categoryId: 3, sales: 7890, rating: 4.7, createdAt: '2024-01-13T00:00:00.000Z' },
  { id: 14, name: '自然堂冰肌水（160ml）', price: 89, stock: 250, description: '补水保湿、提亮肤色，国货经典', image: '/images/自然堂冰肌水.jpg', categoryId: 3, sales: 6543, rating: 4.6, createdAt: '2024-01-14T00:00:00.000Z' },
  { id: 15, name: '手机透明壳（适用苹果/华为）', price: 15, stock: 1000, description: '全包防摔、高清透亮，百搭款', image: '/images/手机透明壳.jpg', categoryId: 4, sales: 25678, rating: 4.5, createdAt: '2024-01-15T00:00:00.000Z' },
  { id: 16, name: '快充数据线（1米Type-C）', price: 12.9, stock: 800, description: '加粗铜线、兼容多数机型，易损耗品', image: '/images/快充数据线.png', categoryId: 4, sales: 19876, rating: 4.6, createdAt: '2024-01-16T00:00:00.000Z' },
  { id: 17, name: '纯棉纯色T恤（男女同款）', price: 39.9, stock: 300, description: '柔软透气、多色可选，基础百搭款', image: '/images/纯棉纯色T恤.jpg', categoryId: 5, sales: 8765, rating: 4.7, createdAt: '2024-01-17T00:00:00.000Z' },
  { id: 18, name: '帆布托特包（大容量）', price: 29.9, stock: 200, description: '耐磨百搭、学生/通勤适用', image: '/images/帆布托特包.jpg', categoryId: 5, sales: 5678, rating: 4.8, createdAt: '2024-01-18T00:00:00.000Z' }
]

const initialProducts = JSON.parse(JSON.stringify(products))

let categories = [
  { id: 1, name: '家居日用品', parentId: null, sortOrder: 1 },
  { id: 2, name: '休闲零食', parentId: null, sortOrder: 2 },
  { id: 3, name: '美妆护肤', parentId: null, sortOrder: 3 },
  { id: 4, name: '数码配件', parentId: null, sortOrder: 4 },
  { id: 5, name: '服饰鞋包', parentId: null, sortOrder: 5 }
]

let carts = []
let orders = []
let addresses = []
let wishlists = []
let reviews = []

let nextUserId = 2
let nextCartId = 1
let nextOrderId = 1
let nextAddressId = 1
let nextWishlistId = 1
let nextReviewId = 1

const productMap = new Map()
const categoriesCache = { data: null, expiresAt: 0 }
const CATEGORY_CACHE_TTL = 60_000

function rebuildProductMap() {
  productMap.clear()
  products.forEach(p => productMap.set(p.id, p))
}

function getProductById(id) {
  return productMap.get(id)
}

function attachProduct(item) {
  return { ...item, product: getProductById(item.productId) }
}

function getCachedCategories() {
  const now = Date.now()
  if (categoriesCache.data && now < categoriesCache.expiresAt) {
    return categoriesCache.data
  }
  categoriesCache.data = categories
  categoriesCache.expiresAt = now + CATEGORY_CACHE_TTL
  return categoriesCache.data
}

function updateProductRating(productId) {
  const productReviews = reviews.filter(r => r.productId === productId)
  const product = getProductById(productId)
  if (!product) return
  if (productReviews.length === 0) return
  const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
  product.rating = Math.round(avg * 10) / 10
}

function ensureDefaultAddress(userId, addressId, isDefault) {
  if (isDefault) {
    addresses.forEach(a => {
      if (a.userId === userId && a.id !== addressId) {
        a.isDefault = false
      }
    })
  }
}

rebuildProductMap()

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

app.post('/api/users/register', (req, res) => {
  const { username, password, email, phone } = req.body

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' })
  }

  const newUser = {
    id: nextUserId++,
    username,
    password,
    email,
    phone: phone || '',
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  res.status(201).json({ message: 'User registered successfully' })
})

app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body

  const user = users.find(u => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' })

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    }
  })
})

app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt
  })
})

app.put('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const { email, phone } = req.body
  if (email !== undefined) user.email = email
  if (phone !== undefined) user.phone = phone

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt
  })
})

app.get('/api/users/addresses', authenticateToken, (req, res) => {
  const userAddresses = addresses.filter(a => a.userId === req.user.userId)
  res.json(userAddresses)
})

app.post('/api/users/addresses', authenticateToken, (req, res) => {
  const newAddress = {
    id: nextAddressId++,
    userId: req.user.userId,
    ...req.body
  }
  ensureDefaultAddress(req.user.userId, newAddress.id, newAddress.isDefault)
  addresses.push(newAddress)
  res.status(201).json(newAddress)
})

app.put('/api/users/addresses/:id', authenticateToken, (req, res) => {
  const index = addresses.findIndex(a => a.id === parseInt(req.params.id) && a.userId === req.user.userId)

  if (index === -1) {
    return res.status(404).json({ message: 'Address not found' })
  }

  addresses[index] = { ...addresses[index], ...req.body }
  ensureDefaultAddress(req.user.userId, addresses[index].id, addresses[index].isDefault)
  res.json(addresses[index])
})

app.delete('/api/users/addresses/:id', authenticateToken, (req, res) => {
  const index = addresses.findIndex(a => a.id === parseInt(req.params.id) && a.userId === req.user.userId)

  if (index === -1) {
    return res.status(404).json({ message: 'Address not found' })
  }

  addresses.splice(index, 1)
  res.json({ message: 'Address deleted' })
})

app.get('/api/wishlist', authenticateToken, (req, res) => {
  const userWishlist = wishlists
    .filter(w => w.userId === req.user.userId)
    .map(w => ({
      ...w,
      product: getProductById(w.productId)
    }))
    .filter(w => w.product)
  res.json(userWishlist)
})

app.get('/api/wishlist/ids', authenticateToken, (req, res) => {
  const ids = wishlists
    .filter(w => w.userId === req.user.userId)
    .map(w => w.productId)
  res.json(ids)
})

app.post('/api/wishlist', authenticateToken, (req, res) => {
  const { productId } = req.body

  if (!getProductById(productId)) {
    return res.status(404).json({ message: 'Product not found' })
  }

  const existing = wishlists.find(w => w.userId === req.user.userId && w.productId === productId)
  if (existing) {
    return res.json({ ...existing, product: getProductById(productId) })
  }

  const newItem = {
    id: nextWishlistId++,
    userId: req.user.userId,
    productId,
    createdAt: new Date().toISOString()
  }
  wishlists.push(newItem)
  res.status(201).json({ ...newItem, product: getProductById(productId) })
})

app.delete('/api/wishlist/:productId', authenticateToken, (req, res) => {
  const productId = parseInt(req.params.productId)
  const index = wishlists.findIndex(w => w.userId === req.user.userId && w.productId === productId)

  if (index === -1) {
    return res.status(404).json({ message: 'Wishlist item not found' })
  }

  wishlists.splice(index, 1)
  res.json({ message: 'Removed from wishlist' })
})

app.get('/api/products/:id/reviews', (req, res) => {
  const productId = parseInt(req.params.id)
  const { page = 1, size = 10 } = req.query

  if (!getProductById(productId)) {
    return res.status(404).json({ message: 'Product not found' })
  }

  const productReviews = reviews
    .filter(r => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const start = (parseInt(page) - 1) * parseInt(size)
  const end = start + parseInt(size)

  res.json({
    items: productReviews.slice(start, end),
    total: productReviews.length,
    page: parseInt(page),
    size: parseInt(size)
  })
})

app.post('/api/products/:id/reviews', authenticateToken, (req, res) => {
  const productId = parseInt(req.params.id)
  const { rating, content } = req.body

  if (!getProductById(productId)) {
    return res.status(404).json({ message: 'Product not found' })
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Review content is required' })
  }

  const existing = reviews.find(r => r.productId === productId && r.userId === req.user.userId)
  if (existing) {
    return res.status(400).json({ message: 'You have already reviewed this product' })
  }

  const newReview = {
    id: nextReviewId++,
    productId,
    userId: req.user.userId,
    username: req.user.username,
    rating,
    content: content.trim(),
    createdAt: new Date().toISOString()
  }

  reviews.push(newReview)
  updateProductRating(productId)

  res.status(201).json(newReview)
})

app.get('/api/products', (req, res) => {
  let filteredProducts = [...products]

  const { page = 1, size = 10, categoryId, keyword, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

  if (categoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === parseInt(categoryId))
  }

  if (keyword) {
    const kw = keyword.toLowerCase()
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw)
    )
  }

  filteredProducts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1
    }
    return a[sortBy] < b[sortBy] ? 1 : -1
  })

  const start = (parseInt(page) - 1) * parseInt(size)
  const end = start + parseInt(size)

  res.json({
    items: filteredProducts.slice(start, end),
    total: filteredProducts.length,
    page: parseInt(page),
    size: parseInt(size)
  })
})

app.get('/api/products/categories', (req, res) => {
  res.json(getCachedCategories())
})

app.get('/api/products/:id', (req, res) => {
  const product = getProductById(parseInt(req.params.id))

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.json(product)
})

app.get('/api/cart', authenticateToken, (req, res) => {
  const userCart = carts.filter(c => c.userId === req.user.userId)
  res.json(userCart.map(attachProduct))
})

app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body
  const product = getProductById(productId)

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  const existingItem = carts.find(c => c.userId === req.user.userId && c.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
    res.json(attachProduct(existingItem))
  } else {
    const newItem = {
      id: nextCartId++,
      userId: req.user.userId,
      productId,
      quantity
    }
    carts.push(newItem)
    res.status(201).json(attachProduct(newItem))
  }
})

app.put('/api/cart/:id', authenticateToken, (req, res) => {
  const { quantity } = req.body
  const index = carts.findIndex(c => c.id === parseInt(req.params.id) && c.userId === req.user.userId)

  if (index === -1) {
    return res.status(404).json({ message: 'Cart item not found' })
  }

  carts[index].quantity = quantity
  res.json(attachProduct(carts[index]))
})

app.delete('/api/cart/:id', authenticateToken, (req, res) => {
  const index = carts.findIndex(c => c.id === parseInt(req.params.id) && c.userId === req.user.userId)

  if (index === -1) {
    return res.status(404).json({ message: 'Cart item not found' })
  }

  carts.splice(index, 1)
  res.json({ message: 'Cart item deleted' })
})

app.delete('/api/cart', authenticateToken, (req, res) => {
  carts = carts.filter(c => c.userId !== req.user.userId)
  res.json({ message: 'Cart cleared' })
})

app.get('/api/orders', authenticateToken, (req, res) => {
  const { page = 1, size = 10, status } = req.query

  let userOrders = orders.filter(o => o.userId === req.user.userId)

  if (status) {
    userOrders = userOrders.filter(o => o.status === status)
  }

  const ordersWithDetails = userOrders.map(order => ({
    ...order,
    address: addresses.find(a => a.id === order.addressId),
    items: order.items.map(item => ({
      ...item,
      product: getProductById(item.productId)
    }))
  }))

  const start = (parseInt(page) - 1) * parseInt(size)
  const end = start + parseInt(size)

  res.json({
    items: ordersWithDetails.slice(start, end),
    total: ordersWithDetails.length,
    page: parseInt(page),
    size: parseInt(size)
  })
})

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id) && o.userId === req.user.userId)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  res.json({
    ...order,
    address: addresses.find(a => a.id === order.addressId),
    items: order.items.map(item => ({
      ...item,
      product: getProductById(item.productId)
    }))
  })
})

app.post('/api/orders', authenticateToken, (req, res) => {
  const { addressId } = req.body

  const address = addresses.find(a => a.id === addressId && a.userId === req.user.userId)
  if (!address) {
    return res.status(400).json({ message: 'Invalid address' })
  }

  const userCart = carts.filter(c => c.userId === req.user.userId)

  if (userCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' })
  }

  for (const item of userCart) {
    const product = getProductById(item.productId)
    if (!product) {
      return res.status(400).json({ message: `Product ${item.productId} not found` })
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `${product.name} 库存不足，当前库存 ${product.stock} 件` })
    }
  }

  const orderItems = userCart.map(item => ({
    id: Date.now() + Math.random(),
    orderId: nextOrderId,
    productId: item.productId,
    quantity: item.quantity,
    price: getProductById(item.productId).price
  }))

  for (const item of userCart) {
    const product = getProductById(item.productId)
    product.stock -= item.quantity
    product.sales += item.quantity
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const newOrder = {
    id: nextOrderId++,
    userId: req.user.userId,
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
  carts = carts.filter(c => c.userId !== req.user.userId)

  res.status(201).json(newOrder)
})

app.put('/api/orders/:id/cancel', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id) && o.userId === req.user.userId)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Cannot cancel order' })
  }

  for (const item of order.items) {
    const product = getProductById(item.productId)
    if (product) {
      product.stock += item.quantity
      product.sales -= item.quantity
    }
  }

  order.status = 'cancelled'
  res.json(order)
})

app.put('/api/orders/:id/pay', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id) && o.userId === req.user.userId)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Order is not pending' })
  }

  order.status = 'paid'
  order.payTime = new Date().toISOString()

  setTimeout(() => {
    if (order.status === 'paid') {
      order.status = 'shipped'
      order.shipTime = new Date().toISOString()
    }
  }, 1000)

  res.json(order)
})

app.put('/api/orders/:id/complete', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id) && o.userId === req.user.userId)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  if (order.status !== 'shipped') {
    return res.status(400).json({ message: 'Order is not shipped yet' })
  }

  order.status = 'completed'
  order.completeTime = new Date().toISOString()
  res.json(order)
})

export function resetStore() {
  users = [
    { id: 1, username: 'admin', password: '123456', email: 'admin@example.com', phone: '13800138000', createdAt: '2024-01-01T00:00:00.000Z' }
  ]
  carts = []
  orders = []
  addresses = []
  wishlists = []
  reviews = []
  nextUserId = 2
  nextCartId = 1
  nextOrderId = 1
  nextAddressId = 1
  nextWishlistId = 1
  nextReviewId = 1
  products = JSON.parse(JSON.stringify(initialProducts))
  rebuildProductMap()
  categoriesCache.data = null
  categoriesCache.expiresAt = 0
}

app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

export { app }

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}
