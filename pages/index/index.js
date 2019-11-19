var app = getApp();
//index.js
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    imgUrls: [],
    indicatorDots: true,
    duration: 500,
    imgwidth: 750,
    imgheights: [], 
    current: 0,
    gradeImg: [
      '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
    ],  //评分图片
    hotWords: ['薪酬设计','职业规划','人才发展'], //热词
    teacherList: [],
    territory: [
      { name: '薪酬设计', check: false },
      { name: '职业规划', check: false },
      { name: '人才发展', check: false },
      { name: '组织变革', check: false }
    ],
    display: 'none',
    animation1: [],
    animation2: [],
    price: [0,0],
    follow: false,
    notReady: 0,
    nowPage: 1,
    allPage: 1,
    getMore: ['点击加载更多'],
    teacherImg: app.globalData.getDataUrl,
    timeArray: ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'],
    startTime: '08:00',
    endTime: '24:00',
    isSelectTime: false
  },
  onReady:function(){
    this.animation1 = wx.createAnimation();
    this.animation2 = wx.createAnimation();
  },
  onLoad: function(){
    this.getList();
  },
  onShow: function(){
    var _self = this;
    // 请求图片轮播图
    var imgUrls = [];
    wx.request({
      url: app.globalData.edition+'/banner/list',
      success: function(res){
        res.data.forEach(function(item,index){
          imgUrls.push({ url: app.globalData.getDataUrl+item.pic_url,goods_id:item.goods_id})
        })
        _self.setData({ imgUrls: imgUrls})
      },
      complete: function (res) {
        app.warning(res);
      }
    })
    
    // 获取热门主题
    var hotWords = [];
    wx.request({
      url: app.globalData.edition + '/tag/list?page=1&per_page=4',
      success: function (res) {
        res.data.data.forEach(function (item, index) {
          hotWords.push(item.tag);
        })
        _self.setData({ hotWords: hotWords })
      },
      complete: function (res) {
        app.warning(res);
      }
    })
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if (userInfo && token) {
      // 请求未读消息
      wx.request({
        url: app.globalData.edition + '/message/unreadCount',
        method: 'get',
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if (res.data>=0) {
            _self.setData({ notReady: res.data })
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
    }
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
    this.setData({ animation1: this.animation1.export(),animation2: this.animation2.export(),display:'none' });
    if(option.currentTarget.dataset.type == 'request'){
      this.setData({ teacherList: [], getMore: ['点击加载更多'], nowPage: 1, allPage: 1 });
      this.getList(1);
    } else if (option.currentTarget.dataset.type == 'clear'){
      var newArr = this.data.territory;
      newArr.forEach(function(item,index){
        item.check = false;
      })
      this.setData({
        teacherList: [], getMore: ['点击加载更多'], nowPage: 1, allPage: 1 ,
        startTime: '08:00',endTime: '24:00',inputVal: '',price: [0,0],territory: newArr
      });
      this.getList();
    }
  },
  translateShow: function () {
    this.animation1.translate('-15.9em', 0).step();
    this.animation2.opacity(0.5).step();
    this.setData({ animation1: this.animation1.export(), animation2: this.animation2.export(),display:'block' })
  },
  search: function (event){
    var inputVal = event.detail.value;
    this.setData({ teacherList: [], getMore: ['点击加载更多'], nowPage: 1, allPage: 1 });
    this.getList(1);
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
  },
  bindGetUserInfo:function(){
    wx.getUserInfo({
      success: function (res) {
        if (!res.userInfo) {
          return;
        }
        wx.setStorageSync('userInfo', res.userInfo)
        // _self.login();
      },
      fail: function(res){
        console.log(res)
      }
    })
  },
  callTel: function () {
    wx.showModal({
      title: '提示',
      content: '是否拨打电话咨询客服',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '15010568939',
            success: function (res) {
              console.log(res)
            },
            complete: function (res) {
              app.warning(res);
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  showKong: function(){
    this.setData({follow:true})
  },
  getList: function(option){
    var _self = this;
    var nowPage = this.data.nowPage;
    var opt = this.data.teacherList;
    var obj = {},a = [],b = [],c = [];
    if (this.data.getMore[0] == '点击加载更多') {

      this.data.territory.forEach(function(item,index){
        if (item.check){
          a.push(item.name);
        }
      })
      if(this.data.price[0] != 0 || this.data.price[1] != 0){
        if(this.data.price[0] > this.data.price[1]){
          var num0 = this.data.price[1];
          var num1 = this.data.price[0];
          this.setData({price:[num0,num1]})
          c = this.data.price;
        } else {
          c = this.data.price;
        }
      }

      var num2 = parseInt(this.data.startTime);
      var num3 = parseInt(this.data.endTime);
      if(this.data.isSelectTime){
        if ((num3 - num2) <= 1){
          b.push(parseInt(this.data.startTime));
        }else{
          for (var i = 0; i < (num3 - 1);i++){
            if(num2 < (num3-1)){
              num2++;
              b.push(num2);
            }
          }
          b.unshift(parseInt(this.data.startTime));
        }
      }
      if(option){
        var data = {
          page: nowPage,
          keyword: _self.data.inputVal,
          tags_in: a,
          price_between: c,
          times_in: b
        }
      }else{
        var data = {
          page: nowPage,
          keyword: '',
          tags_in: [],
          price_between: [],
          times_in: []
        }
      }
      wx.request({
        url: app.globalData.edition + '/teacher/list',
        method: 'post',
        dataType: "json",
        data: data,
        success: function (res) {
          res.data.data.forEach(function (item, index) {
            var item = item;
            opt.push(item);
          })
          nowPage++;
          if (nowPage > res.data.last_page) {
            nowPage = res.data.last_page;
            var arrs = [];
            arrs[0] = '已全部加载';
            _self.setData({ getMore: arrs })
          }
          _self.setData({ teacherList: opt, nowPage: nowPage, allPage: res.data.last_page })
        },
        complete: function (res) {
          app.warning(res);
        }
      })
    } else {
      wx.showToast({
        title: '已全部加载'
      })
    }
  },
  bindPickerChange: function (e) {
    var name = e.currentTarget.dataset.name;
    if(name == 'start'){
      var time0 = this.data.timeArray[e.detail.value];
      var time1 = this.data.endTime;
      if (parseInt(time0) > parseInt(time1)) {
        wx.showModal({
          title: '警告',
          content: '开始时间不能大于结束时间，请重新选择',
          showCancel: false
        })
        return;
      }
      this.setData({
        startTime: this.data.timeArray[e.detail.value],
        isSelectTime: true
      })
    }else{
      var time0 = this.data.startTime;
      var time1 = this.data.timeArray[e.detail.value];
      if (parseInt(time0) > parseInt(time1)) {
        wx.showModal({
          title: '警告',
          content: '结束时间不能小于开始时间，请重新选择',
          showCancel: false
        })
        return;
      }
      this.setData({
        endTime: this.data.timeArray[e.detail.value],
        isSelectTime: true
      })
    }
  },
  changeWord: function(e){
    this.setData({ inputVal: e.detail.value})
  },
  changePrice: function(e){
    var price = this.data.price;
    if(e.currentTarget.dataset.index == 0){
      price[0] = Number(e.detail.value);
      this.setData({price: price})
    }else{
      price[1] = Number(e.detail.value);
      this.setData({ price: price })
    }
  },
  clearWord: function(){
    this.setData({inputVal: ''})
  }
})
