var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   id: '',
   order_no: '',
   info: '',
   gradeImg: [
     '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
   ],  //评分图片
   manner: 0, //态度
   major: 0, //专业
   satisfied: 0, //满意
   content: '',
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
      app.readMsg(this.data.id, this);
      app.getOrderMsg(this.data.order_no, this);
      var tims = setInterval(function () {
        if (_self.data.info) {
          clearInterval(tims);
          if (_self.data.info.order_eval){
            _self.setData({
              manner: _self.data.info.order_eval.attitude,
              major: _self.data.info.order_eval.speciality,
              satisfied: _self.data.info.order_eval.satisfaction,
              content: _self.data.info.order_eval.content
            })
          }
        }
      }, 1000)
      this.setData({ tims: tims })
    }
  },
  onUnload: function () {
    clearInterval(this.data.tims)
  },
  costAdd: function(event){
    var index = event.currentTarget.dataset.index;
    var name = event.currentTarget.dataset.name;
    var manner = this.data.manner;
    var major = this.data.major;
    var satisfied = this.data.satisfied;
    if(name == 'manner'){
      this.setData({ manner: manner+index+1})
    }else if(name == 'major'){
      this.setData({ major: major + index + 1 })
    }else{
      this.setData({ satisfied: satisfied + index + 1 })
    }
  },
  costSub: function (event) {
    var index = event.currentTarget.dataset.index;
    var name = event.currentTarget.dataset.name;
    var manner = this.data.manner;
    var major = this.data.major;
    var satisfied = this.data.satisfied;
    if (name == 'manner') {
      this.setData({ manner: index+1 })
    } else if (name == 'major') {
      this.setData({ major: index + 1 })
    } else {
      this.setData({ satisfied: index + 1 })
    }
  },
  chageValue: function(event){
    this.setData({ content: event.detail.value})
  },
  submit: function(){
    var _self = this;
    if (this.data.manner == 0 || this.data.major == 0 || this.data.satisfied == 0){
      wx.showToast({
        title: '请完善评星',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.request({
        url: app.globalData.edition + '/order/order_eval?order_no='+this.data.order_no,
        method: 'post',
        data: {
          attitude: _self.data.manner,
          speciality: _self.data.major,
          satisfaction: _self.data.satisfied,
          content: _self.data.content
        },
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if(res.data.code == 0){
            _self.skipTo();
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
    }
  },
  notSubmit: function(){
    this.skipTo();
  },
  skipTo: function(){
    wx.showModal({
      title: '提示',
      content: '评价成功，即将跳转到个人中心',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        }
      }
    })
  }
})