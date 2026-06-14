# 电商购物平台

基于 Vue3 + Node.js 构建的前后端分离电商购物平台。

## 功能特性

- ✅ **商品展示**：商品列表、商品详情、分页排序
- ✅ **商品搜索**：关键词搜索、分类筛选、价格/销量排序
- ✅ **购物车**：添加商品、修改数量、删除商品、实时计算
- ✅ **下单流程**：地址选择、订单确认、订单创建
- ✅ **订单管理**：订单列表、状态筛选、订单详情、取消/支付/确认收货
- ✅ **用户系统**：注册登录、JWT Token 认证、路由守卫
- ✅ **地址管理**：添加/编辑/删除收货地址
- ✅ **收藏功能**：收藏商品、收藏列表

## 技术栈

### 前端
- Vue 3 + TypeScript
- Vite 构建工具
- Element Plus UI组件库
- Pinia 状态管理
- Vue Router 路由管理
- Axios HTTP客户端
- TailwindCSS 样式框架

### 后端
- Node.js + Express
- JWT (jsonwebtoken) 身份认证
- CORS 跨域支持

## 项目结构

```
shopping-platform/
├── src/                          # 前端源码
│   ├── api/                      # API接口定义
│   │   ├── products.ts           # 商品接口
│   │   ├── orders.ts             # 订单接口
│   │   ├── cart.ts               # 购物车接口
│   │   ├── user.ts               # 用户接口
│   │   ├── addresses.ts          # 地址接口
│   │   └── wishlist.ts           # 收藏接口
│   ├── components/               # 公共组件
│   │   ├── Header.vue            # 页头导航
│   │   ├── Footer.vue            # 页脚
│   │   └── ProductCard.vue       # 商品卡片
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义和守卫
│   ├── stores/                   # Pinia状态管理
│   │   ├── user.ts              # 用户状态
│   │   ├── cart.ts              # 购物车状态
│   │   ├── order.ts             # 订单状态
│   │   ├── catalog.ts           # 商品目录状态
│   │   └── wishlist.ts          # 收藏状态
│   ├── types/                    # TypeScript类型定义
│   │   └── index.ts              # 数据类型
│   ├── utils/                    # 工具函数
│   │   └── request.ts            # HTTP请求封装
│   ├── views/                    # 页面组件
│   │   ├── Home.vue             # 首页
│   │   ├── ProductList.vue      # 商品列表
│   │   ├── ProductDetail.vue    # 商品详情
│   │   ├── Cart.vue             # 购物车
│   │   ├── OrderConfirm.vue     # 订单确认
│   │   ├── OrderList.vue        # 订单列表
│   │   ├── OrderDetail.vue      # 订单详情
│   │   ├── UserCenter.vue       # 个人中心
│   │   ├── Login.vue            # 登录页
│   │   └── Register.vue         # 注册页
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 入口文件
├── backend/                      # 后端源码
│   └── server.js                 # 主服务文件
├── public/                       # 静态资源
│   └── images/                   # 商品图片
├── docs/                         # 项目文档
│   ├── 登录验证原理说明.md
│   ├── 查询功能前后端工作过程说明.md
│   └── AI问答记录.md
├── package.json                  # 前端依赖配置
├── vite.config.ts                # Vite配置
├── tsconfig.json                 # TypeScript配置
└── .gitignore                    # Git忽略规则
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```powershell
# 前端依赖
cd "shopping platform"
npm install

# 后端依赖
cd "shopping platform/backend"
npm install
```

### 启动服务

```powershell
# 启动后端服务（端口：3000）
cd "shopping platform/backend"
npm run dev

# 启动前端服务（端口：5173）
# 新开一个终端窗口
cd "shopping platform"
npm run dev
```

### 访问项目

- 前端地址：http://localhost:5173
- 后端API：http://localhost:3000

### 测试账号

- 用户名：`admin`
- 密码：`123456`

## API接口

### 用户接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/users/register | POST | 用户注册 |
| /api/users/login | POST | 用户登录 |
| /api/users/profile | GET | 获取用户信息 |
| /api/users/profile | PUT | 更新用户信息 |

### 商品接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/products | GET | 商品列表（支持分页、筛选、排序） |
| /api/products/:id | GET | 商品详情 |
| /api/products/categories | GET | 分类列表 |

### 购物车接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/cart | GET | 获取购物车 |
| /api/cart | POST | 添加商品到购物车 |
| /api/cart/:id | PUT | 更新购物车商品 |
| /api/cart/:id | DELETE | 删除购物车商品 |

### 订单接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/orders | GET | 订单列表 |
| /api/orders | POST | 创建订单 |
| /api/orders/:id | GET | 订单详情 |
| /api/orders/:id/cancel | PUT | 取消订单 |
| /api/orders/:id/pay | PUT | 支付订单 |
| /api/orders/:id/confirm | PUT | 确认收货 |

### 地址接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/addresses | GET | 地址列表 |
| /api/addresses | POST | 添加地址 |
| /api/addresses/:id | PUT | 更新地址 |
| /api/addresses/:id | DELETE | 删除地址 |

## 登录验证原理

详细说明请参考 [登录验证原理说明](docs/登录验证原理说明.md)

## 查询功能工作过程

详细说明请参考 [查询功能前后端工作过程说明](docs/查询功能前后端工作过程说明.md)

## 开发规范

### 代码规范
- 使用 TypeScript 类型定义
- 组件使用 PascalCase 命名
- API接口按模块划分
- 统一错误处理

### Git 规范
- 提交信息格式：`<type>: <description>`
- 类型：feat, fix, docs, style, refactor, test, chore
- 分支：main（主分支）、feature/*（功能分支）

## 部署说明

### 开发模式
```powershell
npm run dev
```

### 生产构建
```powershell
# 前端构建
npm run build

# 后端生产模式
cd backend
node server.js
```

## 许可证

MIT License
