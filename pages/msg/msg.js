var app = getApp();
Page({
  data: {
    arr: [],
    isTeacher: false,
    nowPage: 1,
    allPage: 1
  },
  onLoad: function(){
    var _self = this;
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('userInfo');
    if (userInfo && token) {
      // 判断身份
      wx.request({
        url: app.globalData.edition + '/teacher/my_teacher_info',
        method: 'get',
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if (res.data.data) {
            _self.setData({ isTeacher: true })
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
      this.getList(1)
    }
  },
  getList: function(option){
    var _self = this;
    var arr = this.data.arr;
    wx.request({
      url: app.globalData.edition + '/message/list?page='+option,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        if(res.data.data){
          res.data.data.forEach(function(item,index){
            arr.push(item)
          })
          _self.setData({ arr: arr, allPage: res.data.last_page})
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  },
  delOne: function(event){
    wx.request({
      url: app.globalData.edition + '/message/deleteMsg?id=' + id,
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
        app.warning(res);
      }
    })
  },
  delAll: function (event) {
    wx.request({
      url: app.globalData.edition + '/message/delete',
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
        app.warning(res);
      }
    })
  },
  readyAll: function (event){
    wx.request({
      url: app.globalData.edition + '/message/markAsReadForAll',
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
        app.warning(res);
      }
    })
  }
})