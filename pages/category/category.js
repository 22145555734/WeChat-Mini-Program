// pages/category/category.js
const { categoryApi, bookApi } = require("../../utils/api.js"); 

Page({
  data: {
    categories: [],
    currentId: 1,
    currentBooks: [],
    loading: false,
  },

  onLoad(options) {
    const currentId = options.id ? parseInt(options.id) : 1;
    this.setData({ currentId });
    this.loadCategories();
  },

  // 加载分类（拦截器已返回 data.data，直接赋值）
  loadCategories() {
    this.setData({ loading: true });
    categoryApi.getCategories()
      .then(data => {
        this.setData({ categories: data });
        this.loadBooks(this.data.currentId);
      })
      .catch(err => console.error(err))
      .finally(() => this.setData({ loading: false }));
  },

  // 加载图书（数据在 records 中）
  loadBooks(categoryId) {
    if (!categoryId) return;
    this.setData({ loading: true });
    bookApi.getBooks({ categoryId, page: 1, limit: 50 })
      .then(data => {
        // 后端返回：data = { records: [], total, size }
        this.setData({ currentBooks: data.records || [] });
      })
      .catch(err => console.error(err))
      .finally(() => this.setData({ loading: false }));
  },

  // 切换分类
  onCategoryTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({ currentId: id });
    this.loadBooks(id);
  },

  // 跳转详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/book-detail/book-detail?id=${id}` });
  },
});