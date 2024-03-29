//index.js
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    imgUrls: [
      '/images/0706.jpg', '/images/0706.jpg', '/images/0706.jpg',
    ],
    indicatorDots: true,
    duration: 500,
    imgwidth: 750,
    imgheights: [],
    current: 0,
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    grade: 3.5, //评分
    hotWords: ['薪酬设计','职业规划','人才发展'], //热词
    teacherList: [ //老师数据
      {

      }
    ],
    territory: [
      { name: '薪酬设计', check: false },
      { name: '职业规划', check: false },
      { name: '人才发展', check: false },
      { name: '组织变革', check: false }
    ],
    display: 'none',
    animation1: [],
    animation2: [],
    territoryVal: '',
    price: [12,43],
    time: [9,9,12],
    teacherList:[
      { headerImg: '/images/headerImg.jpg', name: '陈楚华', grade: 3.5, original: 400, price: 300, company: '阿里巴巴有限公司CEO', territory:['职业规划','组织发展','职业晋升'],num1:234,num2:534,num3:45},
      { headerImg: '/images/xiaohu.jpg', name: '小虎', grade:5, original: 400, price: 300, company: '阿里巴巴有限公司CEO', territory: ['职业规划', '组织发展', '职业晋升'], num1: 234, num2: 534, num3: 45 }
    ]
  },
  onReady:function(){
    this.animation1 = wx.createAnimation();
    this.animation2 = wx.createAnimation();
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  // 设置swiper高度
  imageLoad: function (e) {//获取图片真实宽度  
    var srceenWidth = 0;
    wx.getSystemInfo({
      success(res) {
        srceenWidth = res.windowWidth;
      }
    })
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = srceenWidth*0.9 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },
  // 动画
  translateHide: function (option) {
    var witch = option.currentTarget.id;  //确定按钮的id  B-09261151
    this.animation1.translate('15.9em', 0).step();
    this.animation2.opacity(0).step();
    this.setData({ animation1: this.animation1.export(),animation2: this.animation2.export(),display:'none' })
  },
  translateShow: function () {
    this.animation1.translate('-15.9em', 0).step();
    this.animation2.opacity(0.5).step();
    this.setData({ animation1: this.animation1.export(), animation2: this.animation2.export(),display:'block' })
  },
  search: function (event){
    var inputVal = event.detail.value;
  },
  addSelect: function(event){
    var arr = this.data.territory;
    var name = event.currentTarget.dataset.name;
    arr.forEach(function(item,index){
      if(item.check == false && item.name == name){
        item.check = true;
      } else if (item.check == true && item.name == name){
        item.check = false;
      }
    })
    this.setData({
      territory: arr
    })
  }
})
