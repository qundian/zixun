Page({
  data: {
    orderList: [
      { teacherName: '张三', price: '300', time: '9月4日 6:00-7:00', ques:'如何做好招聘',state:true},
      { teacherName: '张三', price: '200', time: '9月7日 6:00-7:00', ques: '如何做好招聘', state: true }
    ],
    onceList: [
      { teacherName: '张三', price: '300', profit: 200,punish:0,time: '9月4日 6:00-7:00', long: '56', ques: '如何做好招聘', grade: 3.5, discuss: '迟到了二十分钟，这使得贝克汉姆只能回到休息室等BLACKPINK，直接导致活动比预定时间拖延了将近一个小时，许多专程参加活动的粉丝因为BLACKPINK的迟到，未能得到贝克汉姆的签名和合影'}
    ],
    listState: 'now',
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    showDialog: false,
    istrue: false
  },
  change: function(event){
    this.setData({
      listState: event.currentTarget.dataset.name
    })
  },
  openConfirm: function () {
    wx.showModal({
      title: '弹窗标题',
      content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      confirmText: "主操作",
      cancelText: "辅助操作",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作')
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
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
  }
})