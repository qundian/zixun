var app = getApp();
Page({
  data: {
    
  },
  onShow: function(){
    wx.hideHomeButton();
  },
  onUnload: function(){
    if (!wx.getStorageSync('userInfo') && !wx.getStorageSync('token')){
      wx.showModal({
        title: '提示',
        content: '您还没登录，无法正常使用小程序！',
        confirmText: '去登录',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  rejectLogin: function (e) {
    wx.navigateBack({

    })
  },
  bindGetUserInfo: function () {
    var _self = this;
    wx.getUserInfo({
      success: function (res) {
        if (!res.userInfo) {
          return;
        }
        wx.setStorageSync('userInfo', res.userInfo)
        _self.login();
      }
    })
  },
  login: function () {
    var _self = this;
    var token = wx.getStorageSync('token');
    if (token) {
      wx.request({
        url: app. globalData.domain + '/api/wechat/login',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            wx.removeStorageSync('token')
            _self.login();
          } else {
            // 回到原来的地方放
            // wx.navigateBack();
            var path = wx.getStorageSync('path');
            wx.redirectTo({
              url: '/' + path
            })
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        // debugger
        wx.request({
          url: app. globalData.domain + '/api/wechat/login',
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res.data.code)
            if (res.data.code == 10000) {
              // 去注册
              _self.registerUser();
              return;
            }
            else if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('uid', res.data.data.uid)
            wx.setStorageSync('info', res.data.data)
            // 回到原来的页面
            // wx.navigateBack();
            var path = wx.getStorageSync('path');
            wx.redirectTo({
              url: '/' + path
            })
          }
        })
      }
    })
  },
  registerUser: function () {
    var _self = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: app. globalData.domain + '/api/wechat/register',
              data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                _self.login();
              }
            })
          }
        })
      }
    })
  }
})