// 时间格式化
function formatTime(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

// 订单状态文本
function statusText(status) {
  switch (status) {
    case "PAID":
      return "已支付";
    case "CANCELED":
      return "已取消";
    case "SHIPPED":
      return "已发货";
    case "COMPLETED":
      return "已完成";
    case "PENDING":
    default:
      return "待支付";
  }
}

// 价格格式化
function formatPrice(price) {
  return Number(price || 0).toFixed(2);
}

module.exports = {
  formatTime,
  statusText,
  formatPrice,
};
