var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   id: '',
   order_no: '',
   info: '',
  },
  onLoad: function (options) {
    this.setData({ id: options.id, order_no: options.order_no })
  },
  onShow: function () {
    var _self = this;
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if (userInfo && token) {
      app.readMsg(this.data.id, this);
      app.getOrderMsg(this.data.order_no, this);
      var tims = setInterval(function () {
        if (_self.data.info) {
          clearInterval(tims);
          var item = _self.data.info;
          if (item.start_at > new Date().getTime() / 1000) {
            item.state = 1;
          } else if (item.start_at <= new Date().getTime() / 1000 && item.end_at > new Date().getTime() / 1000) {
            item.state = 2;
          } else if (item.end_at < new Date().getTime() / 1000) {
            item.state = 3;
          }
          _self.setData({ info: item })
        }
      }, 1000)
      this.setData({ tims: tims })
    }
  },
  onUnload: function () {
    clearInterval(this.data.tims)
  },
})