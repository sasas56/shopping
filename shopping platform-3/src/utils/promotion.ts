import type { ProductPromotion } from '../types'

const PROMOTION_TAGS = ['限时秒杀', '新品特惠', '满减活动', '会员专享']

/** 根据商品 ID 生成模拟促销数据（演示父组件传值用） */
export function getProductPromotion(productId: number, price: number): ProductPromotion | null {
  if (productId % 3 === 0) return null

  const endTime = new Date(Date.now() + 2 * 3600 * 1000 + 35 * 60 * 1000 + 42 * 1000).toISOString()

  return {
    active: true,
    tag: PROMOTION_TAGS[productId % PROMOTION_TAGS.length],
    discountLabel: `${((85 + (productId % 4) * 3) / 10).toFixed(1)}折`,
    endTime,
    originalPrice: Math.round(price * 1.25 * 100) / 100
  }
}
