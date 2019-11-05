var app = getApp();
Page({
  data: {
    id: '',
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    isCollect: false,
    showDialog: false,
    istrue: false,
    isIphoneX: '',
    data: '',
    userHeaderImgUrl: app.globalData.userHeaderImgUrl,
    dateArr: [],
    timeList: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-24:00']
  },
  onLoad: function (options){
    var _self = this;
    _self.setData({ isIphoneX: app.globalData.isIphoneX, id: options.id })
  },
  onShow: function (options) {
    var _self = this;
    // 可预约时间
    function addDate(dd, dadd) {
      var a = new Date(dd)
      a = a.valueOf()
      a = a + dadd * 24 * 60 * 60 * 1000
      a = new Date(a)
      return a;
    }
    var now = new Date();
    var dataTitle = [];//保存获取到的日期
    var prev = '';
    var arr = [];
    var timeList = this.data.timeList;
    for (var i = 0; i < 30; i++) {
      var month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1); 
      var date = (month + "-" + now.getDate());
      if (date == '12-31') {
        prev = '12-31';
      } else if (prev == '12-31') {
        month = 1;
      }
      var c_day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
      dataTitle[i] = (month + "-" + c_day);
      now = addDate(month + "/" + now.getDate() + "/" + now.getFullYear(), 1);
      var time = [];
      for (var z = 0; z < 16; z++) {
        var obj = {
          date: dataTitle[i],
          part: timeList[z],
          state: false
        }
        time.push(obj);
      }
      arr.push(time);
    }
    this.setData({ dateArray: dataTitle, dateArr: arr})
    // 请求页面全部数据
    wx.request({
      url: app.globalData.edition + '/teacher/detail?id=' + this.data.id,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        _self.setData({ data: res.data })
        res.data.teacher_times.forEach(function (item, index) {
          var start_time = (new Date(item.start_at * 1000)).toString();
          var c_month = (new Date(item.date_at * 1000).getMonth() + 1) < 10 ? "0" + (new Date(item.date_at * 1000).getMonth() + 1) : (new Date(item.date_at * 1000).getMonth() + 1);
          var c_day = (new Date(item.date_at * 1000).getDate()) < 10 ? "0" + (new Date(item.date_at * 1000).getDate()) : (new Date(item.date_at * 1000).getDate());
          var monthDay = c_month + '-' + c_day;
          start_time = start_time.split(' ')[4].substring(0, 5);
          _self.bianli(monthDay,start_time);
        })
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
  },
  collect: function(){
    var id = this.data.id;
    var data = this.data.data;
    if (data.user_like_count == 0){
      data.user_like_count = 1;
      wx.request({
        url: app.globalData.edition + '/teacher/post_like_teacher?id=' + id,
        method: 'get',
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          
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
    }else{
      data.user_like_count = 0;
      wx.request({
        url: app.globalData.edition + '/teacher/delete_like_teacher?id=' + id,
        method: 'get',
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          
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
    this.setData({
      data: data
    })
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
  bianli: function(monthDay,hour){
    var _self = this;
    var c_month = (new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var c_day = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
    var c_date = c_month + '-' + c_day;
    var dateArr = this.data.dateArr;
    dateArr.forEach(function(item,index){
      item.forEach(function(a,b){
        if (a.date == monthDay && a.part.split('-')[0] == hour){
          if(monthDay == c_date && hour.substring(0,2) < new Date().getHours()){
            
          }else{
            a.state = true;
          }
        }
      })
    })
    this.setData({ dateArr: dateArr})
  }
})