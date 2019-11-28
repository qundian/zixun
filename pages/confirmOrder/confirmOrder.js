var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   istrue: false, //时间弹出
   id: '',
   order_no: '',
   info: '',
   value: ''
  },
  onLoad: function (options){
    this.setData({id: options.id,order_no:options.order_no})
  },
  onShow: function(){
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if (userInfo && token) {
      app.readMsg(this.data.id, this);
      app.getOrderMsg(this.data.order_no, this);
    }
  },
  openDialog: function () {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function (e) {
    var _self = this;
    this.setData({
      istrue: false
    })
    if(e.currentTarget.dataset.type == 'sure'){
      // if(!_self.data.value){
      //   wx.showToast({
      //     title: '请输入取消理由！',
      //   })
      //   return;
      // }
      wx.request({
        url: app.globalData.edition + '/order/teacherCancelOrder',
        method: 'post',
        data: {
          order_no: _self.data.order_no,
          remark: _self.data.value
        },
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if(res.data.code == 0){
            wx.showToast({
              title: '取消成功',
            })
          }else{
            wx.showToast({
              title: '取消失败',
              icon: 'none'
            })
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
    }
  },
  changeValue: function(e){
    this.setData({
      value: e.detail.value
    })
  }
})