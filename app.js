//app.js
App({
  onLaunch: function () {
    // 获取手机型号，判断是否是苹果刘海手机
    var _self = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model == 'iPhone X' || res.model == 'iPhone XR' || res.model == 'iPhone XS Max' || res.model == 'iPhone 11' || res.model == 'iPhone 11 Pro' || res.model == 'iPhone 11 Pro Max') {
          _self.globalData.isIphoneX = true;
        }
      }
    })
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('userInfo');
    if(!userInfo && !token){
      wx.navigateTo({
        url: '/pages/login/login',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          
        }
      })
    }
  },
  globalData: {
    domain: 'http://zxt.hrpindao.com',
    edition: 'http://zxt.hrpindao.com/api/v1',
    getDataUrl: 'http://zxt.hrpindao.com/storage/',
    userHeaderImgUrl: 'http://zxt.hrpindao.com/storage/',
    userInfo: null,
    isIphoneX: false,
    status: 'teacher'
  },
  warning: function(option){
    if (option.data.message) {
      wx.showModal({
        title: '错误',
        content: option.data.message,
        showCancel: false
      })
    }
  },
  readMsg: function(opt,_self){
    // 设置消息已读
    wx.request({
      url: this.globalData.edition + '/message/markAsRead?id=' + opt,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res)
      },
      complete: function (res) {
        if (res.data.message) {
          wx.showModal({
            title: '错误',
            content: res.data.message,
            showCancel: false
          })
        }
      }
    })
  },
  getOrderMsg: function (opt, _self){
    // 请求订单消息
    wx.request({
      url: this.globalData.edition + '/order/order_info?order_no=' + opt,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        var obj = res.data;
        _self.setData({ info: res.data })
        var start_time = (new Date(res.data.start_at * 1000)).toString();
        start_time = start_time.split(' ')[4].substring(0, 5);
        var c_year = new Date().getFullYear();
        var c_month = (new Date(res.data.start_at * 1000).getMonth() + 1) < 10 ? '0' + (new Date(res.data.start_at * 1000).getMonth() + 1) : (new Date(res.data.start_at * 1000).getMonth() + 1);
        var c_day = new Date(res.data.start_at * 1000).getDate() < 10 ? '0' + new Date(res.data.start_at * 1000).getDate() : new Date(res.data.start_at * 1000).getDate()
        var time = c_year + '-' + c_month + '-' + c_day + ' ' + start_time
        obj.date_at = time;
        _self.setData({ info: obj })
      },
      complete: function (res) {
        if (res.data.message) {
          wx.showModal({
            title: '错误',
            content: res.data.message,
            showCancel: false
          })
        }
      }
    })
  }
})