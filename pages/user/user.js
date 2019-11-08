var app = getApp();
Page({
  data: {
    userInfo: '',
    orderList: [
      { teacherName: '张三', price: '￥300', time: '9月4日 6:00-7:00', ques:'如何做好招聘',state:false},
      { teacherName: '张三', price: '￥200', time: '9月7日 6:00-7:00', ques: '如何做好招聘', state: true }
    ],
    onceList: [
      { teacherName: '张三', price: '￥300', time: '9月4日 6:00-7:00', long: '56', ques: '如何做好招聘', grade: 3.5, discuss: '迟到了二十分钟，这使得贝克汉姆只能回到休息室等BLACKPINK，直接导致活动比预定时间拖延了将近一个小时，许多专程参加活动的粉丝因为BLACKPINK的迟到，未能得到贝克汉姆的签名和合影'}
    ],
    istrue: false, //时间弹出
    listState: 'now',
    waring: '',
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ]  //评分图片
  },
  onShow: function () {
    var _self = this;
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
        complete: function (res) {
          app.warning(res);
        }
      })
    }
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo: userInfo })
  },
  change: function(event){
    this.setData({
      listState: event.currentTarget.dataset.name
    })
  },
  openDialog: function (event) {
    if(event.currentTarget.dataset.name == 'call'){
      this.setData({waring:'确定现在和老师进行通话咨询？'});
    }else{
      this.setData({ waring: '确定要取消和老师的一对一咨询吗？' });
    }
    this.setData({
      istrue: true
    })
  },
  closeDialog: function () {
    this.setData({
      istrue: false
    })
  }
})