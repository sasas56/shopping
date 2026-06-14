/** public/images 目录下已有的本地商品图片（与商品数据 image 字段文件名一致） */
const AVAILABLE_LOCAL_IMAGES = new Set([
  '维达抽纸24包.png',
  '一次性洗脸巾.jpg',
  '加厚垃圾袋.jpg',
  '超能洗衣液.jpg',
  '洁柔湿厕纸.jpg',
  '无痕衣架.jpg',
  '居家拖鞋.jpg',
  '厨房纸巾.jpg',
  '比比赞小麻花.jpg',
  '洽洽香瓜子.jpg',
  '良品铺子Q弹豆干.jpg',
  '慕大姐小鱼仔.jpg',
  '百草味芒果干.jpg',
  '三只松鼠坚果大礼包.jpg',
  '卫龙大面筋辣条.png',
  '良品铺子每日坚果.jpg',
  '珂润润浸保湿面霜.avif',
  '美宝莲眼唇卸妆液.jpg',
  '自然堂冰肌水.jpg',
  '完美日记口红礼盒.jpg',
  '相宜本草四倍蚕丝面膜.png',
  'AHC 玻尿酸精华液.png',
  '百雀羚帧颜修护水乳.jpg',
  '橘朵九色眼影盘.jpg',
  '手机透明壳.jpg',
  '快充数据线.png',
  '绿联 PD 快充充电器.jpg',
  '小米蓝牙耳机 Air2.jpg',
  '罗技无线鼠标.jpg',
  '金士顿 U 盘 128GB.jpg',
  '品胜 20000mAh 充电宝.jpg',
  '纯棉纯色T恤.jpg',
  '帆布托特包.jpg',
  '牛仔裤（直筒修身）.jpg',
  '运动跑鞋（男女同款）.jpg',
  '真丝围巾（春秋款）.jpg',
  '羊毛大衣（中长款）.jpg',
  '珊瑚绒家居棉服.jpg',
  '男士真皮钱包.jpg',
  '保温饭盒（三层）.jpg',
  '陶瓷餐具套装（16 头）.jpg',
  '智能扫地机器人.jpg',
  '空气炸锅（5L）.jpg',
  '每日坚果零食桶.png',
  '黑糖姜茶（20 包）.jpg',
  '云南白药牙膏套装.png',
  '维达卷纸（10 卷）.jpg',
  '三只松鼠牛肉干.jpg',
  '良品铺子阿胶糕.jpg',
  '飞利浦电动牙刷.jpg',
  '南极人四件套（1.8m 床）.jpg',
  '得力中性笔（12 支装）.jpg',
  '乐事薯片大礼包.jpg',
  '高洁丝卫生巾礼盒.jpg'
])

type ProductLike = {
  id: number
  name: string
  categoryId: number
  image?: string
}

function localImageFilename(imagePath: string): string {
  return imagePath.replace(/^\/images\//, '')
}

function hasLocalImage(imagePath?: string): boolean {
  if (!imagePath) return false
  return AVAILABLE_LOCAL_IMAGES.has(localImageFilename(imagePath))
}

/** 根据商品数据返回展示图 URL，优先使用 public/images 中的本地图片 */
export function getProductImageUrl(product: ProductLike): string {
  if (product.image && hasLocalImage(product.image)) {
    return product.image
  }
  return getProductImageFallback(product)
}

/** 图片加载失败时的文字占位图（显示商品名称缩写） */
export function getProductImageFallback(product: ProductLike): string {
  const colors = ['4A90D9', 'F5A623', 'E91E63', '7B61FF', '50C878']
  const color = colors[(product.categoryId - 1) % colors.length] || '999999'
  const label = encodeURIComponent(product.name.replace(/（.*?）/g, '').slice(0, 6))
  return `https://placehold.co/400x400/${color}/ffffff?text=${label}`
}
