var app = getApp();
Page({
 data: {
   status: app.globalData.status,
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
      app.readMsg(this.data.id,this);
      app.getOrderMsg(this.data.order_no,this);
    }
  },
  rePay: function(){
    wx.request({
      url: app.globalData.edition + '/order/repay?order_no=' + this.data.order_no,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        var order_num = res.data.order_no;
        if(res.data.code == 0){
          wx.requestPayment({
            timeStamp: String(res.data.data.timeStamp),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              console.log(res)
            },
            complete: function (res) {
              if (res.errMsg == 'requestPayment:fail cancel') {
                // wx.navigateTo({
                //   url: '/pages/waitPay/waitPay?order_no=' + orser_num
                // })
                wx.showModal({
                  title: '提示',
                  content: '请尽快支付！',
                  showCancel: false
                })
              } else if (res.errMsg == 'requestPayment:ok') {
                wx.navigateTo({
                  url: '/pages/success/success?order_no=' + orser_num
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '支付失败',
                  showCancel: false
                })
              }
            }
          })
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  }
})