var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   istrue: false, //时间弹出
   user:{
     name: '张三', position: '主管', price: 300, time: '2019-11-12 6:00-7:00', content:'近日，可口可乐公司推出全球首款由海洋回收废塑料制成的饮料瓶。第一批塑料瓶共300个，原料中25%的塑料来自志愿者在西班牙和葡萄牙收集的海洋垃圾。从2020年开始，该公司计划在可乐瓶中推广这种回收材料'
   },
   id: '',
   order_no: ''
  },
  onLoad: function (options){
    this.setData({id: options.id,order_no:options.order_no})
  },
  onShow: function(){
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('userInfo');
    if (userInfo && token) {
      // 设置消息已读
      wx.request({
        url: app.globalData.edition + '/message/markAsRead?id='+this.data.id,
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
      // 请求订单消息
      wx.request({
        url: app.globalData.edition + '/order/order_info?order_no=' + this.data.order_no,
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