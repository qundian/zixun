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
    userInfo: null,
    isIphoneX: false,
    status: 'teacher'
  }
})