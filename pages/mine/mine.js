var app = getApp();
Page({
  data: {
    isTeacher: false,
    userInfo: '',
    listState: 'now',
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    istrue: false,
    info: '', //用户信息
    userHeaderImgUrl: app.globalData.userHeaderImgUrl,
    account: 0, //余额
    nowArr: [], //已预约咨询
    nowPage: 1,
    nowAllPage: 1,
    onceArr: [], //咨询历史
    oncePage: 1,
    onceAllPage: 1,
    waitArr: [], //待支付
    waitPage: 1,
    waitAllPage: 1
  },
  onShow: function(){
    var _self = this;
    var info = wx.getStorageSync('info');
    this.setData({ info: info })
    // 判断用户身份
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('userInfo');
    if (userInfo && token) {
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
        complete: function(res){
          app.warning(res);
        }
      })
      // 获取账户余额
      wx.request({
        url: app.globalData.edition + '/user/account',
        header: {
          "Content-Type": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if(res.data.account){
            _self.setData({ account: res.data.account})
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
      // 获取用户基本信息
      wx.request({
        url: app.globalData.edition + '/user/user_info',
        header: {
          "Content-Type": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if (res.data) {
            _self.setData({ userinfo: res.data })
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
      // 请求咨询状态列表
      this.getList(1,20,'nowArr')
    }
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({userInfo:userInfo})
  },
  change: function(event){
    this.setData({
      listState: event.currentTarget.dataset.name,
      nowArr: [], nowPage: 1, nowAllPage: 1,
      onceArr: [], oncePage: 1, onceAllPage: 1,
      waitArr: [], waitPage: 1, waitAllPage: 1,
    })
    if (event.currentTarget.dataset.name == 'now'){
      this.getList(1,20,'nowArr');
    } else if (event.currentTarget.dataset.name == 'once'){
      this.getList(1, 30, 'onceArr');
    }else{
      this.getList(1, 10, 'waitArr');
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
  cancel: function(){
    this.setData({istrue:true})
  },
  getList: function(option1,option2,option3){
    var _self = this;
    // 获取咨询列表
    wx.request({
      url: app.globalData.edition + '/order/order_list',
      method: 'get',
      data: {
        page: option1,
        status: option2
      },
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        if(res.data.data){
          if(option3 == 'nowArr'){
            var arr = _self.data.nowArr;
            res.data.data.forEach(function(item,index){
              if (item.start_at > new Date().getTime() / 1000){
                item.state = 1;
              }else if (item.start_at <= new Date().getTime() / 1000 && item.end_at > new Date().getTime() / 1000){
                item.state = 2;
              } else if (item.end_at < new Date().getTime() / 1000){
                item.state = 3;
              }
              arr.push(item);
            })
            _self.setData({ nowArr: arr })
          }else if(option3 == 'onceArr'){
            var arr = _self.data.nowArr;
            res.data.data.forEach(function (item, index) {
              arr.push(item);
            })
            _self.setData({ onceArr: arr })
          }else{
            var arr = _self.data.nowArr;
            res.data.data.forEach(function (item, index) {
              arr.push(item);
            })
            _self.setData({ waitArr: arr })
          }
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  },
  call: function (event) {
    wx.request({
      url: app.globalData.edition + '/call/bindAx?order_no=' + event.currentTarget.dataset.orderno,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        if (res.data.resultcode == 0) {
          wx.makePhoneCall({
            phoneNumber: res.data.privateNum.toString(),
            success: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          })
        } else {
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
  }
})