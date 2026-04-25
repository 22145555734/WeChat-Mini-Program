// miniprogram/pages/address/address.js
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  setSelectedAddress,
} = require("../../utils/storage.js");

Page({
  data: {
    addresses: [],
    mode: "list", // list 列表模式, select 选择模式
    editing: false,
    editId: null,
    region: [], // 省市区
    form: {
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
    },
  },

  onLoad(options) {
    this.setData({
      mode: options.mode || "list",
    });
  },

  onShow() {
    this.loadAddresses();
  },

  loadAddresses() {
    const addresses = getAddresses();
    this.setData({ addresses });
  },

  onSelectAddress(e) {
    const address = e.currentTarget.dataset.item;
    if (this.data.mode === "select") {
      // 选择模式：保存选择的地址并返回
      setSelectedAddress(address);
      wx.navigateBack();
    }
  },

  onSetDefault(e) {
    const id = e.currentTarget.dataset.id;
    setDefaultAddress(id);
    this.loadAddresses();
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定删除该地址吗？",
      success: (res) => {
        if (res.confirm) {
          deleteAddress(id);
          this.loadAddresses();
        }
      },
    });
  },

  onEdit(e) {
    const address = e.currentTarget.dataset.item;
    this.setData({
      editing: true,
      editId: address.id,
      region: [
        address.province || "",
        address.city || "",
        address.district || "",
      ],
      form: {
        name: address.name,
        phone: address.phone,
        province: address.province || "",
        city: address.city || "",
        district: address.district || "",
        detail: address.detail,
      },
    });
  },

  onAdd() {
    this.setData({
      editing: true,
      editId: null,
      region: [],
      form: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        detail: "",
      },
    });
  },

  onCancelEdit() {
    this.setData({
      editing: false,
      editId: null,
      region: [],
    });
  },

  onRegionChange(e) {
    const [province, city, district] = e.detail.value;
    this.setData({
      region: e.detail.value,
      "form.province": province,
      "form.city": city,
      "form.district": district,
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value,
    });
  },

  onSave() {
    const { form, editId } = this.data;

    if (!form.name.trim()) {
      wx.showToast({ title: "请输入收货人姓名", icon: "none" });
      return;
    }
    if (!form.phone.trim()) {
      wx.showToast({ title: "请输入手机号码", icon: "none" });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
      wx.showToast({ title: "请输入正确的手机号", icon: "none" });
      return;
    }
    if (!form.province || !form.city || !form.district) {
      wx.showToast({ title: "请选择所在地区", icon: "none" });
      return;
    }
    if (!form.detail.trim()) {
      wx.showToast({ title: "请输入详细地址", icon: "none" });
      return;
    }

    // 拼接完整地址
    const fullRegion = form.province + " " + form.city + " " + form.district;
    const addressData = {
      ...form,
      fullAddress: fullRegion + " " + form.detail,
    };

    if (editId) {
      updateAddress(editId, addressData);
    } else {
      addAddress(addressData);
    }

    wx.showToast({ title: "保存成功", icon: "success" });
    this.setData({
      editing: false,
      editId: null,
      region: [],
    });
    this.loadAddresses();
  },
});
