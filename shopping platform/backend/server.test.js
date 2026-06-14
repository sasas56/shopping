import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app, resetStore } from './server.js'

const secretKey = process.env.JWT_SECRET || 'shopping_platform_secret_key'

function getToken(userId = 1, username = 'admin') {
  return jwt.sign({ userId, username }, secretKey, { expiresIn: '1h' })
}

describe('API integration tests', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('auth', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ username: 'admin', password: '123456' })

      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
      expect(res.body.user.username).toBe('admin')
    })

    it('rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ username: 'admin', password: 'wrong' })

      expect(res.status).toBe(401)
    })
  })

  describe('wishlist', () => {
    it('adds and removes wishlist items', async () => {
      const token = getToken()

      const addRes = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 1 })

      expect(addRes.status).toBe(201)
      expect(addRes.body.productId).toBe(1)

      const listRes = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)

      expect(listRes.body).toHaveLength(1)

      const removeRes = await request(app)
        .delete('/api/wishlist/1')
        .set('Authorization', `Bearer ${token}`)

      expect(removeRes.status).toBe(200)
    })
  })

  describe('reviews', () => {
    it('creates and lists product reviews', async () => {
      const token = getToken()

      const createRes = await request(app)
        .post('/api/products/1/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 5, content: 'Great product!' })

      expect(createRes.status).toBe(201)
      expect(createRes.body.rating).toBe(5)

      const listRes = await request(app)
        .get('/api/products/1/reviews')

      expect(listRes.body.items).toHaveLength(1)
      expect(listRes.body.total).toBe(1)
    })

    it('prevents duplicate reviews', async () => {
      const token = getToken()

      await request(app)
        .post('/api/products/1/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 5, content: 'First review' })

      const dupRes = await request(app)
        .post('/api/products/1/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, content: 'Second review' })

      expect(dupRes.status).toBe(400)
    })
  })

  describe('orders', () => {
    it('completes shipped orders', async () => {
      const token = getToken()

      const addressRes = await request(app)
        .post('/api/users/addresses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiver: 'Test',
          phone: '13800138000',
          province: '广东',
          city: '深圳',
          district: '南山',
          detail: '测试地址',
          isDefault: true
        })

      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 1, quantity: 1 })

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ addressId: addressRes.body.id })

      expect(orderRes.status).toBe(201)

      await request(app)
        .put(`/api/orders/${orderRes.body.id}/pay`)
        .set('Authorization', `Bearer ${token}`)

      await new Promise(r => setTimeout(r, 1100))

      const completeRes = await request(app)
        .put(`/api/orders/${orderRes.body.id}/complete`)
        .set('Authorization', `Bearer ${token}`)

      expect(completeRes.status).toBe(200)
      expect(completeRes.body.status).toBe('completed')
      expect(completeRes.body.completeTime).toBeDefined()
    })

    it('rejects order when stock is insufficient', async () => {
      const token = getToken()

      const addressRes = await request(app)
        .post('/api/users/addresses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          receiver: 'Test',
          phone: '13800138000',
          province: '广东',
          city: '深圳',
          district: '南山',
          detail: '测试地址',
          isDefault: true
        })

      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 1, quantity: 99999 })

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ addressId: addressRes.body.id })

      expect(orderRes.status).toBe(400)
      expect(orderRes.body.message).toContain('库存不足')
    })
  })

  describe('profile', () => {
    it('updates user profile', async () => {
      const token = getToken()

      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'new@example.com', phone: '13900139000' })

      expect(res.status).toBe(200)
      expect(res.body.email).toBe('new@example.com')
      expect(res.body.phone).toBe('13900139000')
    })
  })
})
