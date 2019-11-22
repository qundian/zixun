var app = getApp();
Page({
  data: {
    isTeacher: false,
    userInfo: '',
    listState: 'now',
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    isCash: false,
    info: '', //用户信息
    userHeaderImgUrl: app.globalData.userHeaderImgUrl,
    wallet:'', //余额
    nowArr: [], //已预约咨询
    nowPage: 1,
    nowAllPage: 1,
    onceArr: [], //咨询历史
    oncePage: 1,
    onceAllPage: 1,
    waitArr: [], //待支付
    waitPage: 1,
    waitAllPage: 1,
    isLogin: true,
    getMore: ['点击加载更多', '点击加载更多', '点击加载更多'],
    cash: ''
  },
  onShow: function(){
    var _self = this;
    var info = wx.getStorageSync('info');
    this.setData({ info: info })
    // 判断用户身份
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
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
          if(res.data){
            _self.setData({ wallet: res.data})
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
            _self.setData({ userInfo: res.data })
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
      // 请求咨询状态列表
      this.getList(1,20,'nowArr')
    }else{
      this.setData({isLogin:false})
    }
  },
  showCash: function () {
    this.setData({ isCash: true })
  },
  closeCash: function(){
    this.setData({isCash: false})
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
  getMore: function(event){
    var nowPage = this.data.nowPage;
    var oncePage = this.data.oncePage;
    var waitPage = this.data.oncePage;
    var arrs = this.data.getMore;
    if(event.currentTarget.dataset.name == 'now'){
      if(arrs[0] == '点击加载更多'){
        getList(nowPage,20,'nowArr');
      }else{
        wx.showToast({
          title: '已全部加载',
        })
      }
    } else if (event.currentTarget.dataset.name == 'once'){
      if (arrs[1] == '点击加载更多'){
        getList(oncePage, 30, 'onceArr');
      }else{
        wx.showToast({
          title: '已全部加载',
        })
      }
    }else{
      if (arrs[2] == '点击加载更多'){
        getList(waitPage, 10, 'waitArr');
      }else{
        wx.showToast({
          title: '已全部加载',
        })
      }
    }
  },
  getList: function(option1,option2,option3){
    var _self = this;
    var nowPage = this.data.nowPage;
    var oncePage = this.data.oncePage;
    var waitPage = this.data.oncePage;
    var arrs = this.data.getMore;
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
              arr.push(_self.setDate(item));
            })
            nowPage++;
            if (nowPage > res.data.last_page) {
              nowPage = res.data.last_page;
              arrs[0] = '已全部加载';
              _self.setData({ getMore: arrs })
            }
            _self.setData({ nowArr: arr, nowPage: nowPage, nowAllPage: res.data.last_page })
          }else if(option3 == 'onceArr'){
            var arr = _self.data.nowArr;
            res.data.data.forEach(function (item, index) {
              arr.push(_self.setDate(item));
            })
            oncePage++;
            if (oncePage > res.data.last_page) {
              oncePage = res.data.last_page;
              arrs[1] = '已全部加载';
              _self.setData({ getMore: arrs })
            }
            _self.setData({ onceArr: arr, oncePage: oncePage, onceAllPage: res.data.last_page })
          }else{
            var arr = _self.data.nowArr;
            res.data.data.forEach(function (item, index) {
              arr.push(_self.setDate(item));
            })
            waitPage++;
            if (waitPage > res.data.last_page) {
              waitPage = res.data.last_page;
              arrs[2] = '已全部加载';
              _self.setData({ getMore: arrs })
            }
            _self.setData({ waitArr: arr, waitPage: waitPage,waitAllPage:res.data.last_page })
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
            phoneNumber: res.data.relationNum.toString(),
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
  },
  setDate: function(item){
    var start_time = (new Date(item.start_at * 1000)).toString();
    start_time = start_time.split(' ')[4].substring(0, 5);
    var end_time = (new Date(item.end_at * 1000)).toString();
    end_time = end_time.split(' ')[4].substring(0, 5);
    var c_year = new Date().getFullYear();
    var c_month = (new Date(item.start_at * 1000).getMonth() + 1) < 10 ? '0' + (new Date(item.start_at * 1000).getMonth() + 1) : (new Date(item.start_at * 1000).getMonth() + 1);
    var c_day = new Date(item.start_at * 1000).getDate() < 10 ? '0' + new Date(item.start_at * 1000).getDate() : new Date(item.start_at * 1000).getDate()
    var time = c_year + '-' + c_month + '-' + c_day + ' ' + start_time + '-' + end_time
    item.date_at = time;
    return item;
  },
  getCash: function(){
    var _self = this;
    if (_self.data.cash < 1){
      wx.showToast({
        title: '最小金额为1元'
      })
    }else{
    }
      wx.request({
        url: app.globalData.edition + '/user/withdraw/apply',
        method: 'post',
        data: {
          apply_total: _self.data.cash
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
              title: '提现成功',
            })
            var wallet = _self.data.wallet;
            wallet.account = parseInt(wallet.account) - parseInt(_self.data.cash);
            wallet.account_withdraw = parseInt(wallet.account_withdraw)+parseInt(_self.data.cash);
            _self.setData({wallet:wallet})
          }else{
            wx.showToast({
              title: res.data.msg,
            })
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
  },
  changes:function(event){
    this.setData({cash:event.detail.value})
  }
})