var app = getApp();
Page({
 data: {
    name:'',
    tel:'',
    position:'',
    company:'',
    email:''
  },
  changeValue: function(event){
    var dataName = event.currentTarget.dataset.name;
    if(dataName == 'name'){
      this.setData({ name: event.detail.value })
    }else if(dataName == 'tel'){
      this.setData({ tel: event.detail.value })
    }else if(dataName == 'position'){
      this.setData({ position: event.detail.value })
    }else if(dataName == 'company'){
      this.setData({ company: event.detail.value})
    }else if(dataName == 'email'){
      this.setData({ email: event.detail.value})
    }
  },
  sendInfo: function(){
    var _self = this;
    wx.request({
      url: app.globalData.edition +'/user/post_user_info',
      method: 'post',
      data: {
        name: _self.data.name,
        post: _self.data.position,
        phone: _self.data.tel,
        email: _self.data.email,
        company: _self.data.company
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
})