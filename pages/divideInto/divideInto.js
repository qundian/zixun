var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   istrue: false, //时间弹出
   id: '',
   order_no: '',
   info: ''
  },
  onLoad: function (options) {
    this.setData({ id: options.id, order_no: options.order_no })
  },
  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if (userInfo && token) {
      app.readMsg(this.data.id, this);
      app.getOrderMsg(this.data.order_no, this);
    }
  },
  openDialog: function () {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function () {
    this.setData({
      istrue: false
    })
  },
})