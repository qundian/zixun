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
    territoryVal: '',
    price: [12,43],
    time: [9,9,12],
    follow: false,
    notReady: 0,
    nowPage: 1,
    allPage: 1,
    getMore: ['点击加载更多']
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
    wx.getSystemInfo({
      success(res) {
        
      }
    })
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
          if (res.data) {
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
    // 请求老师列表信息
    var obj = {};
    var opt = this.data.teacherList;
    if (this.data.getMore[0] == '点击加载更多') {
      wx.request({
        url: app.globalData.edition + '/teacher/list?page=' + nowPage,
        success: function (res) {
          res.data.data.forEach(function (item, index) {
            obj = {
              headerImg: app.globalData.getDataUrl + item.list_img_url,
              name: item.name,
              grade: item.score,
              original: item.original_price,
              price: item.price,
              company: item.background,
              territory: [],
              num1: item.consultants,
              num2: item.duration,
              num3: item.eval_num,
              id: item.id
            }
            item.tags.forEach(function (a, b) {
              obj.territory.push(a.tag);
            })
            opt.push(obj);
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
        title: '已全部加载',
      })
    }
  }
})
