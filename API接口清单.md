# 微信小程序图书商城 - API接口清单

| 序号 | 模块   | 接口名称     | 请求方法 | 接口路径                     | 功能描述           | 请求参数                                        | 返回数据                  |
| ---- | ------ | ------------ | -------- | ---------------------------- | ------------------ | ----------------------------------------------- | ------------------------- |
| 1    | 首页   | 获取轮播图   | GET      | `/api/banners`               | 获取首页轮播图列表 | -                                               | `id, image, title, link`  |
| 2    | 首页   | 获取分类列表 | GET      | `/api/categories`            | 获取图书分类列表   | -                                               | `id, name, icon, sort`    |
| 3    | 首页   | 获取热门图书 | GET      | `/api/books/hot`             | 获取热门推荐图书   | `page, limit`                                   | 图书列表                  |
| 4    | 首页   | 获取新书列表 | GET      | `/api/books/new`             | 获取最新上架图书   | `page, limit`                                   | 图书列表                  |
| 5    | 图书   | 获取图书详情 | GET      | `/api/books/:id`             | 根据ID获取图书详情 | `id`                                            | 完整图书信息              |
| 6    | 图书   | 按分类查询   | GET      | `/api/books`                 | 按分类ID查询图书   | `categoryId, page, limit, sort`                 | 图书列表                  |
| 7    | 图书   | 搜索图书     | GET      | `/api/books/search`          | 按关键词搜索图书   | `keyword, page, limit`                          | 图书列表                  |
| 8    | 图书   | 检查库存     | GET      | `/api/books/:id/stock`       | 检查图书库存数量   | `id`                                            | `stock`                   |
| 9    | 购物车 | 获取购物车   | GET      | `/api/cart`                  | 获取用户购物车列表 | -                                               | 购物车商品列表            |
| 10   | 购物车 | 添加商品     | POST     | `/api/cart`                  | 添加商品到购物车   | `bookId, count`                                 | 购物车ID                  |
| 11   | 购物车 | 更新数量     | PUT      | `/api/cart/:id`              | 更新购物车商品数量 | `id, count`                                     | 更新结果                  |
| 12   | 购物车 | 删除商品     | DELETE   | `/api/cart/:id`              | 从购物车删除商品   | `id`                                            | 删除结果                  |
| 13   | 购物车 | 勾选商品     | PUT      | `/api/cart/:id/check`        | 勾选/取消勾选商品  | `id, checked`                                   | 更新结果                  |
| 14   | 购物车 | 全选/全不选  | PUT      | `/api/cart/check-all`        | 全选或全不选购物车 | `checked`                                       | 更新结果                  |
| 15   | 订单   | 创建订单     | POST     | `/api/orders`                | 创建新订单         | `items[], addressId, remark`                    | 订单ID                    |
| 16   | 订单   | 订单列表     | GET      | `/api/orders`                | 获取用户订单列表   | `status, page, limit`                           | 订单列表                  |
| 17   | 订单   | 订单详情     | GET      | `/api/orders/:id`            | 获取订单详情       | `id`                                            | 完整订单信息              |
| 18   | 订单   | 取消订单     | PUT      | `/api/orders/:id/cancel`     | 取消待支付订单     | `id`                                            | 取消结果                  |
| 19   | 订单   | 支付订单     | POST     | `/api/orders/:id/pay`        | 支付订单           | `id, payMethod`                                 | 支付结果                  |
| 20   | 地址   | 地址列表     | GET      | `/api/addresses`             | 获取用户收货地址   | -                                               | 地址列表                  |
| 21   | 地址   | 添加地址     | POST     | `/api/addresses`             | 新增收货地址       | `name, phone, province, city, district, detail` | 地址ID                    |
| 22   | 地址   | 更新地址     | PUT      | `/api/addresses/:id`         | 修改收货地址       | `id, name, phone...`                            | 更新结果                  |
| 23   | 地址   | 删除地址     | DELETE   | `/api/addresses/:id`         | 删除收货地址       | `id`                                            | 删除结果                  |
| 24   | 地址   | 设为默认     | PUT      | `/api/addresses/:id/default` | 设置默认收货地址   | `id`                                            | 更新结果                  |
| 25   | 地址   | 获取默认地址 | GET      | `/api/addresses/default`     | 获取默认收货地址   | -                                               | 默认地址                  |
| 26   | 用户   | 用户登录     | POST     | `/api/auth/login`            | 微信授权登录       | `code, encryptedData, iv`                       | `token, userInfo`         |
| 27   | 用户   | 用户退出     | POST     | `/api/auth/logout`           | 退出登录           | -                                               | 退出结果                  |
| 28   | 用户   | 获取用户信息 | GET      | `/api/user/profile`          | 获取当前用户信息   | -                                               | 用户信息                  |
| 29   | 用户   | 更新用户信息 | PUT      | `/api/user/profile`          | 更新用户资料       | `nickname, avatar`                              | 更新结果                  |
| 30   | 搜索   | 热门关键词   | GET      | `/api/search/hot`            | 获取热门搜索词     | -                                               | 关键词列表                |
| 31   | 搜索   | 搜索历史     | GET      | `/api/search/history`        | 获取用户搜索历史   | -                                               | 历史关键词                |
| 32   | 搜索   | 保存搜索词   | POST     | `/api/search/history`        | 保存搜索关键词     | `keyword`                                       | 保存结果                  |
| 33   | 搜索   | 清空历史     | DELETE   | `/api/search/history`        | 清空搜索历史       | -                                               | 删除结果                  |
| 34   | 辅助   | 上传Token    | GET      | `/api/upload/token`          | 获取文件上传凭证   | -                                               | `token, url`              |
| 35   | 辅助   | 意见反馈     | POST     | `/api/feedback`              | 用户提交意见反馈   | `content, contact`                              | 提交结果                  |
| 36   | 辅助   | 订单统计     | GET      | `/api/orders/stats`          | 获取订单状态统计   | -                                               | `pendingCount, paidCount` |

---

## 接口分类统计

| 模块       | 接口数量 | 主要功能                           |
| ---------- | -------- | ---------------------------------- |
| 首页模块   | 4        | 轮播图、分类、热门/新书            |
| 图书模块   | 4        | 详情、列表、搜索、库存             |
| 购物车模块 | 6        | 增删改查、勾选                     |
| 订单模块   | 6        | 创建、列表、详情、取消、支付、统计 |
| 地址模块   | 6        | 增删改查、默认地址                 |
| 用户模块   | 4        | 登录、退出、信息                   |
| 搜索模块   | 4        | 热门、历史、保存、清空             |
| 辅助模块   | 2        | 上传、反馈                         |
| **总计**   | **36**   |                                    |

---

## 通用响应格式

```json
{
  "code": 0, // 0: 成功, 其他: 错误码
  "message": "success", // 提示信息
  "data": {} // 返回数据
}
```

## 通用分页响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [], // 数据列表
    "total": 100, // 总条数
    "page": 1, // 当前页
    "limit": 10, // 每页条数
    "pages": 10 // 总页数
  }
}
```
