const express = require("express");
const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());

// 测试路由
app.get("/", (req, res) => {
  res.send("✅ Express 服务运行正常！");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "图书商城API服务运行正常",
    timestamp: new Date().toISOString(),
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`
========================================
🚀 Express 服务器已启动！
📍 服务地址: http://localhost:${PORT}
✅ 健康检查: http://localhost:${PORT}/api/health
========================================
  `);
});
