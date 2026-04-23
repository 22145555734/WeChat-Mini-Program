const books = require("../../data/books.js");

const SEARCH_HISTORY_KEY = "BOOK_SEARCH_HISTORY";
const MAX_HISTORY_COUNT = 10;

Page({
  data: {
    keyword: "",
    history: [],
    results: [],
    showResults: false,
    hotKeywords: ["小说", "历史", "编程", "心理学", "经济"],
  },

  onLoad() {
    this.loadHistory();
  },

  // 加载搜索历史
  loadHistory() {
    const history = wx.getStorageSync(SEARCH_HISTORY_KEY) || [];
    this.setData({ history });
  },

  // 保存搜索历史
  saveHistory(keyword) {
    if (!keyword.trim()) return;

    let history = wx.getStorageSync(SEARCH_HISTORY_KEY) || [];

    // 移除已存在的相同关键词
    history = history.filter((item) => item !== keyword);

    // 添加到开头
    history.unshift(keyword);

    // 限制数量
    if (history.length > MAX_HISTORY_COUNT) {
      history = history.slice(0, MAX_HISTORY_COUNT);
    }

    wx.setStorageSync(SEARCH_HISTORY_KEY, history);
    this.setData({ history });
  },

  // 输入关键词
  onInput(e) {
    this.setData({
      keyword: e.detail.value,
    });
  },

  // 执行搜索
  doSearch(keyword) {
    if (!keyword.trim()) {
      wx.showToast({
        title: "请输入搜索关键词",
        icon: "none",
      });
      return;
    }

    // 保存搜索历史
    this.saveHistory(keyword);

    // 搜索图书
    const results = books.filter((book) => {
      const searchText = keyword.toLowerCase();
      return (
        book.name.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        (book.publisher && book.publisher.toLowerCase().includes(searchText))
      );
    });

    this.setData({
      results,
      showResults: true,
    });

    if (results.length === 0) {
      wx.showToast({
        title: "未找到相关图书",
        icon: "none",
      });
    }
  },

  // 点击搜索按钮
  onSearch() {
    this.doSearch(this.data.keyword);
  },

  // 点击热门搜索或历史搜索
  onKeywordTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch(keyword);
  },

  // 清空搜索历史
  clearHistory() {
    wx.showModal({
      title: "提示",
      content: "确定要清空搜索历史吗？",
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(SEARCH_HISTORY_KEY);
          this.setData({ history: [] });
        }
      },
    });
  },

  // 跳转到图书详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`,
    });
  },

  // 清空输入
  clearInput() {
    this.setData({
      keyword: "",
      results: [],
      showResults: false,
    });
  },
});
