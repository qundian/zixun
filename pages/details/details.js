var app = getApp();
Page({
  data: {
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    grade: 3.5, //评分
    arr: [
      { date: '今天', time: [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]},
      { date: '明天', time: [false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false] },
      { date: '后天', time: [false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false] },
      { date: '10/01', time: [false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false] },
      { date: '10/02', time: [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { date: '10/03', time: [false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false] },
      { date: '10/04', time: [false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false] },
      { date: '10/05', time: [false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false] },
      { date: '10/06', time: [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { date: '10/07', time: [false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false] },
      { date: '10/08', time: [false, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false] },
      { date: '10/09', time: [false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false] }
    ],
    isCollect: false,
    showDialog: false,
    istrue: false,
    isIphoneX: ''
  },
  onLoad: function () {
    var _self = this;
    _self.setData({ isIphoneX: app.globalData.isIphoneX })
  },
  collect: function(){
    var isCollect = this.data.isCollect;
    this.setData({
      isCollect: !isCollect
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
  }
})