!function () {
  var PageTmp = Page;

  Page = function (pageConfig) {

    // 设置全局默认分享
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        return {
          title: '职接问',
          path: '/pages/index/index',
          imageUrl: '/images/screen.jpg'
        };
      }
    }, pageConfig);

    PageTmp(pageConfig);
  };
}();
//app.js
App({
  onLaunch: function () {
    console.log('appjs')
    // 获取手机型号，判断是否是苹果刘海手机
    var _self = this;
    wx.getSystemInfo({
      success(res) {
        if (res.model == 'iPhone X' || res.model == 'iPhone XR' || res.model == 'iPhone XS Max' || res.model == 'iPhone 11' || res.model == 'iPhone 11 Pro' || res.model == 'iPhone 11 Pro Max') {
          _self.globalData.isIphoneX = true;
        }
      }
    })
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1];
      if (view) {
        if (view.route != 'pages/login/login'){
          wx.setStorageSync('path', view.route);
        }
      }
    })
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if(!token){
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },
  globalData: {
    domain: 'http://zxt.hrpindao.com',
    edition: 'http://zxt.hrpindao.com/api/v1',
    getDataUrl: 'http://zxt.hrpindao.com/storage/',  //轮播图
    userHeaderImgUrl: 'http://tt.hrpindao.com/',  //评论头像
    userInfo: null,
    isIphoneX: false
  },
  warning: function(option){
    if (option.data.message || (option.data.msg && option.data.msg != '成功' && option.data.code != 0)) {
      wx.showModal({
        title: '提示',
        content: option.data.message || option.data.msg,
        showCancel: false
      })
    }
  },
  readMsg: function(opt){
    var _self = this;
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
        
      },
      complete: function (res) {
        _self.warning(res);
      }
    })
  },
  getOrderMsg: function (opt, _self){
    var _that = this;
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
        var end_time = (new Date(res.data.end_at * 1000)).toString();
        end_time = end_time.split(' ')[4].substring(0, 5);
        var c_year = new Date().getFullYear();
        var c_month = (new Date(res.data.start_at * 1000).getMonth() + 1) < 10 ? '0' + (new Date(res.data.start_at * 1000).getMonth() + 1) : (new Date(res.data.start_at * 1000).getMonth() + 1);
        var c_day = new Date(res.data.start_at * 1000).getDate() < 10 ? '0' + new Date(res.data.start_at * 1000).getDate() : new Date(res.data.start_at * 1000).getDate()
        var time = c_year + '-' + c_month + '-' + c_day + ' ' + start_time + '-' + end_time
        obj.date_at = time;
        _self.setData({ info: obj })
      },
      complete: function (res) {
        _that.warning(res);
      }
    })
  }
})