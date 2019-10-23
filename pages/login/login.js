var app = getApp();
Page({
  data: {
    
  },
  onLoad: function(){
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
      },
      fail(res){
        console.log(res)
      }
    })
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
            wx.navigateBack();
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
            // 回到原来的页面
            wx.navigateBack();
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