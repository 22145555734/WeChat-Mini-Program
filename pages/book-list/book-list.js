const books = require("../../data/books.js");

Page({
  data: {
    categoryId: null,
    categoryName: "全部图书",
    bookList: [],
  },

  onLoad(options) {
    const categoryId = options.categoryId ? Number(options.categoryId) : null;
    const categoryName = options.categoryName || "全部图书";

    let list = books;
    if (categoryId) {
      // 这里假设 books 里的分类字段是 categoryId
      list = books.filter((item) => Number(item.categoryId) === categoryId);
    }

    this.setData({
      categoryId,
      categoryName,
      bookList: list,
    });

    wx.setNavigationBarTitle({
      title: categoryName,
    });
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`,
    });
  },
});
