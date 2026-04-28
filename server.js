const express = require("express");
const app = express();
const PORT = 3000;

// 模拟数据
const banners = require("./data/banners.js");
const categories = require("./data/categories.js");
const books = require("./data/books.js");
const addresses = require("./data/address.js");

// 中间件
app.use(express.json());

// CORS跨域处理
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ==================== Token 验证中间件 ====================
// 内存存储：用户列表和 Token
let users = [
  { id: 1, username: "admin", password: "123456", nickname: "管理员" },
  { id: 2, username: "test", password: "123456", nickname: "测试用户" },
];
let userTokens = {}; // 存储 userId 和 token 的映射

// 生成简单 Token（生产环境应该用 JWT）
function generateToken(userId) {
  const token =
    "token_" +
    userId +
    "_" +
    Date.now() +
    "_" +
    Math.random().toString(36).slice(2);
  userTokens[userId] = token;
  return token;
}

// 验证 Token
function verifyToken(token) {
  for (const userId in userTokens) {
    if (userTokens[userId] === token) {
      return parseInt(userId);
    }
  }
  return null;
}

// Token 验证中间件
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: 401,
      message: "请先登录",
    });
  }

  const token = authHeader.split(" ")[1];
  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({
      code: 401,
      message: "Token 无效或已过期",
    });
  }

  // 将用户 ID 存入请求对象，后续接口可以使用
  req.userId = userId;
  next();
};

// ==================== 用户接口 ====================

// 登录
app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    const token = generateToken(user.id);
    res.json({
      code: 200,
      message: "登录成功",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
        },
      },
    });
  } else {
    res.status(400).json({
      code: 400,
      message: "用户名或密码错误",
    });
  }
});

// 注册
app.post("/api/users/register", (req, res) => {
  const { username, password, nickname } = req.body;

  // 检查用户名是否已存在
  const exists = users.find((u) => u.username === username);
  if (exists) {
    return res.status(400).json({
      code: 400,
      message: "用户名已存在",
    });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password,
    nickname: nickname || username,
  };

  users.push(newUser);
  const token = generateToken(newUser.id);

  res.json({
    code: 200,
    message: "注册成功",
    data: {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
      },
    },
  });
});

// 获取用户信息（需要登录）
app.get("/api/users/info", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (user) {
    res.json({
      code: 200,
      message: "success",
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "用户不存在",
    });
  }
});

// 退出登录
app.post("/api/users/logout", authMiddleware, (req, res) => {
  delete userTokens[req.userId];
  res.json({
    code: 200,
    message: "退出成功",
  });
});

// ==================== 公共接口 ====================

// 测试路由
app.get("/", (req, res) => {
  res.send("✅ Express 服务运行正常！");
});

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "图书商城API服务运行正常",
    timestamp: new Date().toISOString(),
  });
});

// ==================== Banner接口 ====================

// 获取banner列表
app.get("/api/banners", (req, res) => {
  res.json({
    code: 200,
    message: "success",
    data: banners,
  });
});

// ==================== 分类接口 ====================

// 获取分类列表
app.get("/api/categories", (req, res) => {
  res.json({
    code: 200,
    message: "success",
    data: categories,
  });
});

// 获取分类详情
app.get("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const category = categories.find((item) => item.id === parseInt(id));
  if (category) {
    res.json({
      code: 200,
      message: "success",
      data: category,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "分类不存在",
      data: null,
    });
  }
});

// 根据分类获取图书
app.get("/api/categories/:id/books", (req, res) => {
  const { id } = req.params;
  const categoryBooks = books.filter(
    (item) => item.categoryId === parseInt(id),
  );
  res.json({
    code: 200,
    message: "success",
    data: categoryBooks,
  });
});

// ==================== 图书接口 ====================

// 获取图书列表
app.get("/api/books", (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const paginatedBooks = books.slice(start, end);

  res.json({
    code: 200,
    message: "success",
    data: {
      list: paginatedBooks,
      total: books.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
  });
});

// 获取热门图书
app.get("/api/books/hot", (req, res) => {
  const hotBooks = books.filter((item) => item.isHot);
  res.json({
    code: 200,
    message: "success",
    data: hotBooks,
  });
});

// 获取新书
app.get("/api/books/new", (req, res) => {
  const newBooks = books.filter((item) => item.isNew);
  res.json({
    code: 200,
    message: "success",
    data: newBooks,
  });
});

// 搜索图书
app.get("/api/books/search", (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.json({
      code: 200,
      message: "success",
      data: [],
    });
  }

  const searchResults = books.filter(
    (item) =>
      item.name.includes(keyword) ||
      item.author.includes(keyword) ||
      (item.description && item.description.includes(keyword)),
  );

  res.json({
    code: 200,
    message: "success",
    data: searchResults,
  });
});

// 获取图书详情（注意：带参数的路由要放在最后，否则会匹配到 /hot /new /search）
app.get("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((item) => item.id === parseInt(id));
  if (book) {
    res.json({
      code: 200,
      message: "success",
      data: book,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "图书不存在",
      data: null,
    });
  }
});

// ==================== 地址接口 ====================

// 获取地址列表
app.get("/api/addresses", (req, res) => {
  res.json({
    code: 200,
    message: "success",
    data: addresses,
  });
});

// 获取地址详情
app.get("/api/addresses/:id", (req, res) => {
  const { id } = req.params;
  const address = addresses.find((item) => item.id === parseInt(id));
  if (address) {
    res.json({
      code: 200,
      message: "success",
      data: address,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "地址不存在",
      data: null,
    });
  }
});

// 新增地址
app.post("/api/addresses", (req, res) => {
  const newAddress = {
    id: Date.now(),
    ...req.body,
  };
  addresses.push(newAddress);
  res.json({
    code: 200,
    message: "添加成功",
    data: newAddress,
  });
});

// 更新地址
app.put("/api/addresses/:id", (req, res) => {
  const { id } = req.params;
  const index = addresses.findIndex((item) => item.id === parseInt(id));
  if (index !== -1) {
    addresses[index] = { ...addresses[index], ...req.body };
    res.json({
      code: 200,
      message: "更新成功",
      data: addresses[index],
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "地址不存在",
      data: null,
    });
  }
});

// 删除地址
app.delete("/api/addresses/:id", (req, res) => {
  const { id } = req.params;
  const index = addresses.findIndex((item) => item.id === parseInt(id));
  if (index !== -1) {
    addresses.splice(index, 1);
    res.json({
      code: 200,
      message: "删除成功",
      data: null,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "地址不存在",
      data: null,
    });
  }
});

// ==================== 购物车接口（内存存储） ====================

// 每个用户的购物车：{ userId: [{ id, bookId, quantity }, ...] }
let userCarts = {};

// 获取购物车列表（需要登录）
app.get("/api/cart", authMiddleware, (req, res) => {
  const userId = req.userId;
  const cartItems = userCarts[userId] || [];

  const cartWithBooks = cartItems.map((item) => {
    const book = books.find((b) => b.id === item.bookId);
    return { ...item, book };
  });

  res.json({
    code: 200,
    message: "success",
    data: cartWithBooks,
  });
});

// 添加到购物车（需要登录）
app.post("/api/cart", authMiddleware, (req, res) => {
  const userId = req.userId;
  const { bookId, quantity = 1 } = req.body;

  if (!userCarts[userId]) {
    userCarts[userId] = [];
  }

  const cartItems = userCarts[userId];
  const existingItem = cartItems.find((item) => item.bookId === bookId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      id: Date.now(),
      bookId,
      quantity,
    });
  }

  res.json({
    code: 200,
    message: "添加成功",
    data: null,
  });
});

// 更新购物车（需要登录）
app.put("/api/cart/:id", authMiddleware, (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItems = userCarts[userId] || [];
  const item = cartItems.find((item) => item.id === parseInt(id));

  if (item) {
    item.quantity = quantity;
    res.json({
      code: 200,
      message: "更新成功",
      data: item,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "购物车项不存在",
      data: null,
    });
  }
});

// 删除购物车项（需要登录）
app.delete("/api/cart/:id", authMiddleware, (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const cartItems = userCarts[userId] || [];
  const index = cartItems.findIndex((item) => item.id === parseInt(id));

  if (index !== -1) {
    cartItems.splice(index, 1);
    res.json({
      code: 200,
      message: "删除成功",
      data: null,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "购物车项不存在",
      data: null,
    });
  }
});

// 清空购物车（需要登录）
app.delete("/api/cart", authMiddleware, (req, res) => {
  const userId = req.userId;
  userCarts[userId] = [];

  res.json({
    code: 200,
    message: "清空成功",
    data: null,
  });
});

// ==================== 订单接口（内存存储） ====================

// 每个用户的订单：{ userId: [{ id, orderNo, ... }, ...] }
let userOrders = {};

// 获取订单列表（需要登录）
app.get("/api/orders", authMiddleware, (req, res) => {
  const userId = req.userId;
  const orders = userOrders[userId] || [];

  res.json({
    code: 200,
    message: "success",
    data: orders,
  });
});

// 获取订单详情（需要登录）
app.get("/api/orders/:id", authMiddleware, (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const orders = userOrders[userId] || [];
  const order = orders.find((item) => item.id === parseInt(id));

  if (order) {
    res.json({
      code: 200,
      message: "success",
      data: order,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "订单不存在",
      data: null,
    });
  }
});

// 创建订单（需要登录）
app.post("/api/orders", authMiddleware, (req, res) => {
  const userId = req.userId;

  if (!userOrders[userId]) {
    userOrders[userId] = [];
  }

  const newOrder = {
    id: Date.now(),
    orderNo: "ORD" + Date.now(),
    userId,
    ...req.body,
    status: 1,
    createTime: new Date().toISOString(),
  };

  userOrders[userId].push(newOrder);

  res.json({
    code: 200,
    message: "创建成功",
    data: newOrder,
  });
});

// 取消订单（需要登录）
app.put("/api/orders/:id/cancel", authMiddleware, (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const orders = userOrders[userId] || [];
  const order = orders.find((item) => item.id === parseInt(id));

  if (order) {
    order.status = 0;
    res.json({
      code: 200,
      message: "取消成功",
      data: order,
    });
  } else {
    res.status(404).json({
      code: 404,
      message: "订单不存在",
      data: null,
    });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`
========================================
🚀 Express 服务器已启动！
📍 服务地址: http://localhost:${PORT}
✅ 健康检查: http://localhost:${PORT}/api/health
📚 API文档:
  - Banner:   GET /api/banners
  - 分类:     GET /api/categories
  - 图书:     GET /api/books
  - 热门:     GET /api/books/hot
  - 新书:     GET /api/books/new
  - 搜索:     GET /api/books/search?keyword=xxx
  - 地址:     GET /api/addresses
  - 购物车:   GET/POST /api/cart
  - 订单:     GET/POST /api/orders
========================================
  `);
});
