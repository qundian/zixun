var app = getApp();
Page({
 data: {
   id: '',
   order_no: '',
   info: '',
   tims: '' //定时器
  },
  onLoad: function (options) {
    this.setData({ id: options.id, order_no: options.order_no })
  },
  onShow: function () {
    var _self = this;
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if (userInfo && token) {
      app.readMsg(this.data.id,this);
      app.getOrderMsg(this.data.order_no,this);
      var tims = setInterval(function(){
        if(_self.data.info){
          clearInterval(tims);
          var item = _self.data.info;
          if (item.start_at > new Date().getTime() / 1000) {
            item.state = 1;
          } else if (item.start_at <= new Date().getTime() / 1000 && item.end_at > new Date().getTime() / 1000) {
            item.state = 2;
          } else if (item.end_at < new Date().getTime() / 1000) {
            item.state = 3;
          }
          _self.setData({info:item})
        }
      },1000)
      this.setData({tims:tims})
    }
  },
  onUnload: function(){
    clearInterval(this.data.tims)
  },
  call: function(){
    wx.request({
      url: app.globalData.edition + '/call/bindAx?order_no=' + this.data.order_no,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        if (res.data.resultcode == 0){
          wx.makePhoneCall({
            phoneNumber: res.data.relationNum.toString(),
            success: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  },
  overConsultation: function(){
    var _self = this;
    wx.showModal({
      title: '提示',
      content: '确定要结束此次咨询服务？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.edition + '/order/complete?order_no=' + _self.data.order_no,
            method: 'post',
            dataType: "json",
            header: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
            },
            success: function (res) {
              if (res.data == '') {
                wx.showModal({
                  title: '提示',
                  content: '已结束咨询，请评价此次咨询服务',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/Cost/Cost?order_no=' + _self.data.order_no
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
        } else {

        }
      }
    })
    
  },
  cancel: function(){
    wx.showModal({
      title: '提示',
      content: '确定要取消此次咨询服务？',
      success(res) {
        if (res.confirm) {
          
        }else{

        }
      }
    })
  }
})