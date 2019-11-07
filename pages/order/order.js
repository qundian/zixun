var app = getApp();
Page({
  data: {
    id: '',
    account:0,
    price:0,
    timeNum:0, //时间段数量
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    territory: [], //热门主题
    text: '',
    teacherInfo: '',
    isIphoneX: '',
    witchDay: '0', //选中的哪天
    witchPart: [], //选的哪个时间段
    original_price: 0,
    price: 0,
    arr: [],
    showDialog: false,
    istrue: false, //时间弹出
    isShowModel: false, //警告弹出
    waring: '每次预约只可选择同一天内的单个或者连续的时间段',
    timeList:['08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00','20:00-21:00','21:00-22:00','22:00-23:00','23:00-24:00']
  },
  onLoad: function (options){
    var _self = this;
    _self.setData({ isIphoneX: app.globalData.isIphoneX, id: options.id }) //options.id
  },
  onShow: function (options){
    // wx.hideShareMenu();
    var _self = this;
    var now = new Date();
    var dataTitle = [];//保存获取到的日期
    var prev = '';
    var arr = [];
    var timeList = this.data.timeList;
    var emptyArr = [];

    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    var dataArr = [];
    while ((endDate.getTime() - startDate.getTime()) > 0) {
      var year = new Date().getFullYear();
      var month = (startDate.getMonth() + 1).toString().length == 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
      var months = (startDate.getMonth() + 1) < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
      var day = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate() : startDate.getDate();
      var days = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate();
      dataArr.push(months + "-" + days);
      startDate.setDate(startDate.getDate() + 1);

      var time = [];
      for (var z = 0; z < 16; z++) {
        var obj = {
          part: timeList[z],
          isSelect: false,
          date_at: year + '' + month + '' + day,
          start_at: timeList[z].substring(0, 5),
          end_at: timeList[z].substring(6, 11),
          date: month + '-' + day,
          status: false,
          state: false,
          id: ''
        }
        time.push(obj);
      }
      arr.push(time);
      emptyArr.push([]);
    }
    this.setData({ arr: arr, witchPart: emptyArr, timeNum:0})

    // 获取老师信息
    if (this.data.id){
      wx.request({
        url: app.globalData.edition + '/teacher/list?id=' + _self.data.id,
        success: function(res){
          _self.setData({ teacherInfo: res.data[0], original_price: parseInt(res.data[0].original_price), price: parseInt(res.data[0].price)})
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
    // 获取热门主题
    var territory = [];
    wx.request({
      url: app.globalData.edition + '/tag/list?page=1&per_page=4',
      success: function (res) {
        res.data.data.forEach(function(item,index){
          territory.push({name:item.tag,check:false});
        })
        _self.setData({ territory: territory})
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
    // 获取账户余额
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo')){
      wx.request({
        url: app.globalData.edition + '/user/account',
        header: {
          "Content-Type": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          _self.setData({ account: res.data.account})
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
    // 获取可预约时间
    this.getTeacherTime();
  },
  addSelect: function (event) {
    var arr = this.data.territory;
    var name = event.currentTarget.dataset.name;
    arr.forEach(function (item, index) {
      if (item.check == false && item.name == name) {
        item.check = true;
      } else if (item.check == true && item.name == name) {
        item.check = false;
      }
    })
    this.setData({
      territory: arr
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
  closeModel: function () {
    this.setData({
      isShowModel: false
    })
  },
  selectDay: function(event){
    var index = event.currentTarget.dataset.index;
    this.setData({witchDay:index});
  },
  selectTime: function(event){
    var _self = this;
    var index = event.currentTarget.dataset.index;
    var arr = this.data.arr;
    var witchDay = this.data.witchDay;
    var selectArr = this.data.witchPart[witchDay];
    // 给选中的时间段添加选中状态
    var a = selectArr.indexOf(index);
    if(arr[witchDay][index].state){
      if (a == -1) {
        if(selectArr.length == 0){
          selectArr.push(index);
        }else{
          selectArr.forEach(function(item,ind){
            if(Math.abs(index - item) <= 1){
              selectArr.push(index);
            }
          })
        }
      } else {
        selectArr.splice(a,1);
      }       
    }
    selectArr.sort(function (x, y) {
      return x - y;
    });
    selectArr.forEach(function(item,indexs){              
      var next = indexs+1;
      if(next>=15){
        next = 15;
      }
      if (Math.abs(item - selectArr[next]) > 1 && Math.abs(item - selectArr[next])){
        selectArr.splice(next,16);
      }
    })
    arr[witchDay].forEach(function(item,indexs){
      if(selectArr.indexOf(indexs) != -1){
        item.isSelect = true;
      }else{
        item.isSelect = false;
      }
    })
    // 清楚其他日期时间段的选中状态
    arr.forEach(function(item,idx){
      if(idx != witchDay){
        _self.data.witchPart[idx] = [];
      }
      item.forEach(function(option,seat){
        if(idx != _self.data.witchDay){
          option.isSelect = false;
        }
      })
    })
    this.setData({ arr: arr, timeNum: selectArr.length})
  },
  getTeacherTime: function () {
    var _self = this;
    // 查询所有设置时间的日期
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.edition + '/teacher/get_time?id=' + _self.data.id,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          var year = new Date().getFullYear();
          res.data.data.forEach(function (item, index) {
            var start_time = (new Date(item.start_at * 1000)).toString();
            var c_month = (new Date(item.date_at * 1000).getMonth() + 1) < 10 ? '0' + (new Date(item.date_at * 1000).getMonth() + 1) : (new Date(item.date_at * 1000).getMonth() + 1);
            var c_day = new Date(item.date_at * 1000).getDate() < 10 ? '0' + new Date(item.date_at * 1000).getDate() : new Date(item.date_at * 1000).getDate()
            var monthDay = c_month + '' + c_day;
            start_time = start_time.split(' ')[4].substring(0, 5);
            _self.bianli(year + '' + monthDay, start_time, item.id, item.status);
          })
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
  },
  bianli: function (monthDay, hour, id, status) {
    var arr = this.data.arr;
    var year = new Date().getFullYear();
    var c_month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var c_day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    var witchPart = this.data.witchPart;
    arr.forEach(function (item, index) {
      item.forEach(function (a, b) {
        if (a.date_at == monthDay && hour == a.start_at) {
          // parseInt(hour.substring(0, 2)) <= (new Date().getHours() + 1) && monthDay == (year + '' + c_month + '' + c_day)
          if (parseInt(hour.substring(0, 2)) <= new Date().getHours() && monthDay == (year + '' + c_month + '' + c_day) ){
            a.status = true;
          }else{
            if (status == 10){
              a.state = true;
              a.status = true;
              a.id = id;
            }
          }
        }
      })
    })
    this.setData({ witchPart: witchPart, arr: arr })
  },
  pay: function(event){
    var _self = this;
    var a = this.data.witchPart;
    var b = this.data.arr;
    var c = [];
    var d = this.data.territory;
    var e = this.data.text;
    d.forEach(function(item,index){
      if(item.check){
        e+=item.name;
      }
    })
    a.forEach(function(item,index){
      if(item.length > 0){
        b[index].forEach(function(itm,idx){
          if(itm.isSelect){
            c.push(itm.id);
          }
        })
      }
    })
    if(c.length == 0){
      wx.showModal({
        title: '提示',
        content: '请选择预约时间！',
        showCancel: false
      })
      return;
    }
    if (!wx.getStorageSync('user_info')){
      wx.showModal({
        title: '提示',
        content: '请填写基本信息',
        showCancel: false
      })
      return;
    }
    wx.request({
      url: app.globalData.edition + '/order/post_order',
      method: 'post',
      data:{
        teacher_id: _self.data.id,
        times: c,
        subject: e
      },
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res)
        var orser_num = res.data.order_no;
        if (res.data.code == 0) {
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
              if (res.errMsg == 'requestPayment:fail cancel'){
                wx.navigateTo({
                  url: '/pages/waitPay/waitPay?order_no=' + orser_num
                })
              } else if (res.errMsg == 'requestPayment:ok'){
                wx.navigateTo({
                  url: '/pages/success/success?order_no=' + orser_num
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: '支付失败',
                  showCancel: false
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '已被预约出去了，请选择其他时间段',
            showCancel: false
          })
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
  },
  changeValue: function(event){
    this.setData({ text: event.detail.value})
  }
})