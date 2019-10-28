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
    teacherInfo: '',
    isIphoneX: '',
    witchDay: '0', //选中的哪天
    witchPart: [], //选的哪个时间段
    original_price: 0,
    price: 0,
    arr: [
      { date: '09/28', time: [{ state: true }, { state: true }, { state: false }, { state: false }, { state: false }, { state: false }, { state: false }, { state: true }, { state: false }, { state: true }, { state: false }, { state: false }, { state: false }, { state: false }, { state: false }, { state: false }]}
    ],
    showDialog: false,
    istrue: false, //时间弹出
    isShowModel: false, //警告弹出
    waring: '每次预约只可选择同一天内的单个或者连续的时间段',
    timeList:['8:00-9:00','9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00','20:00-21:00','21:00-22:00','22:00-23:00','23:00-24:00']
  },
  onLoad: function (options){
    // wx.hideShareMenu();
    var _self = this;
    _self.setData({ isIphoneX: app.globalData.isIphoneX, id: options.id })
    var arr = this.data.arr;
    var timeList = this.data.timeList;
    arr.forEach(function(item,index){
      item.time.forEach(function(itm,idx){
        // 给日期添加时间段
        itm.part = timeList[idx];
        // 给日期添加预约状态
        if(itm.state){
          item.state = true;
        }
      })
    })
    this.setData({arr:arr})
    // 获取老师信息
    if (options.id){
      wx.request({
        url: app.globalData.edition + '/teacher/list?id=' + options.id, //options.id
        success: function(res){
          _self.setData({ teacherInfo: res.data[0], original_price: parseInt(res.data[0].original_price), price: parseInt(res.data[0].price)})
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
          _self.setData({ account: res.data})
        }
      })
    }
  },
  onShow: function(){
    // console.log(wx.getStorageSync('user_info'))
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
    this.setData({witchDay:index,witchPart:[]});
  },
  selectTime: function(event){
    var _self = this;
    var index = event.currentTarget.dataset.index;
    var arr = this.data.arr;
    var witchPart = _self.data.witchPart;
    var witchDay = this.data.witchDay;
    var timeNum = this.data.timeNum;
    // 给选中的时间段添加选中状态
    var a = witchPart.indexOf(index);
    if (a == -1) {
      if(witchPart.length == 0){
        witchPart.push(index);
      }else{
        witchPart.forEach(function(item,ind){
          if(Math.abs(index - item) <= 1){
            witchPart.push(index);
          }
        })
      }
    } else {
      witchPart.splice(a,1);
    }       
    // if (index - witchPart[witchPart.length - 1] > 1 || index - witchPart[witchPart.length - 1] < 0) {
    //   this.setData({ waring: '每次预约只可选择同一天内的单个或者连续的时间段', isShowModel: true })
    // }
    witchPart.sort();
    witchPart.forEach(function(item,indexs){              
      var next = indexs+1;
      if(next>=15){
        next = 15;
      }
      if (Math.abs(item - witchPart[next]) > 1 && Math.abs(item - witchPart[next])){
        // _self.setData({ waring: '本次操作将清除此时间段之后的所有已选择时间段', isShowModel: true })
        witchPart.splice(next,16);
      }
    })
    arr[witchDay].time.forEach(function(item,indexs){
      if(witchPart.indexOf(indexs) != -1){
        item.isSelect = true;
      }else{
        item.isSelect = false;
      }
    })
    // 清楚其他日期时间段的选中状态
    // var clearIsSelect = false;
    arr.forEach(function(item,idx){
      item.time.forEach(function(option,seat){
        if(idx != _self.data.witchDay){
          // if(option.isSelect && !clearIsSelect){
          //   _self.setData({ waring:'每次预约只可选择同一天内的单个或者连续的时间段，此次操作会将您之前的选择清除',isShowModel:true})
          // }
          option.isSelect = false;
          // clearIsSelect = true;
        }
      })
    })
    this.setData({ arr: arr, timeNum: witchPart.length})
  }
})