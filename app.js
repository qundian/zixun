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

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    url: 'http://zxt.hrpindao.com',
    login: 'http://zxt.hrpindao.com/api/wechat/login?',
    register: 'http://zxt.hrpindao.com/api/wechat/register?',
    userInfo: null,
    isIphoneX: false,
    status: 'teacher'
  }
})