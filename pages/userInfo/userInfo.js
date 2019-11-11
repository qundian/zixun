var app = getApp();
Page({
 data: {
    name:'',
    tel:'',
    position:'',
    company:'',
    email:'',
   userinfo: {}
  },
  onShow: function(){
    var _self = this;
    wx.request({
      url: app.globalData.edition + '/user/user_info',
      header: {
        "Content-Type": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res)
        if (res.data) {
          _self.setData({ userinfo: res.data })
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  },
  changeValue: function(event){
    var dataName = event.currentTarget.dataset.name;
    var info = this.data.userinfo;
    if(dataName == 'name'){
      info.name = event.detail.value;
    }else if(dataName == 'tel'){
      info.phone = event.detail.value;
    }else if(dataName == 'position'){
      info.post = event.detail.value;
    }else if(dataName == 'company'){
      info.company = event.detail.value;
    }else if(dataName == 'email'){
      info.email = event.detail.value;
    }
    this.setData({userinfo:info})
  },
  sendInfo: function(){
    var _self = this;
    var info = this.data.userinfo;
    if(!info.name || !info.phone || !info.post){
      wx.showModal({
        title: '提示',
        content: '必填项不能为空！',
        showCancel: false
      })
      return;
    }
    wx.request({
      url: app.globalData.edition +'/user/post_user_info',
      method: 'post',
      data: {
        name: info.name,
        post: info.post,
        phone: info.phone,
        email: info.email,
        company: info.company
      },
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function(res){
        if(!res.data.message){
          wx.setStorageSync('user_info', res.data)
          wx.navigateBack();
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  }
})