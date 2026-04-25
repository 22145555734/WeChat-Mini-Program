// pages/category/category.js
const categories = require("../../data/categories.js");
const books = require("../../data/books.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    currentId: 1,
    currentBooks: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const currentId = options.id ? parseInt(options.id) : 1;
    this.setData({
      categories,
      currentId,
    });
    this.loadBooks(currentId);
  },

  /**
   * 加载图书列表
   */
  loadBooks(categoryId) {
    const currentBooks = books.filter((b) => b.categoryId === categoryId);
    this.setData({
      currentBooks,
    });
  },

  /**
   * 切换分类
   */
  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id,
    });
    this.loadBooks(id);
  },

  /**
   * 跳转到图书详情
   */
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`,
    });
  },
});
