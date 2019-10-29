var app = getApp();
Page({
  data: {
    showDialog: false,
    istrue: false, //时间弹出
    dateArray:[],
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    witchDay: '0',
    witchPart: [],
    arr: [],
    timeList: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-24:00']
  },
  onLoad: function(){
    var _self = this;
    var now = new Date();
    var dataTitle = [];//保存获取到的日期
    var prev = '';
    var arr = [];
    var timeList = this.data.timeList;
    var addArr = this.data.witchPart;

    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    var dataArr = [];
    while ((endDate.getTime() - startDate.getTime()) >= 0) {
      var year = new Date().getFullYear();
      var month = (startDate.getMonth() + 1).toString().length == 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
      var months = startDate.getMonth() + 1;
      var day = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate() : startDate.getDate();
      var days = startDate.getDate();
      dataArr.push(months + "-" + days);
      startDate.setDate(startDate.getDate() + 1);

      var time = [];
      for (var z = 0; z < 16; z++) {
        var obj = {
          part: timeList[z],
          isSelect: false,
          date_at: year+''+month+''+day,
          start_at: timeList[z].substring(0,5),
          end_at: timeList[z].substring(6,11)
        }
        time.push(obj);
      }
      arr.push(time);
      addArr.push([]);
    }
    this.setData({ dateArray: dataArr, arr: arr, witchPart: addArr})

    // 日历相关代码
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month < 10 ? '0'+month : month,
      isToday:  month +"-"+ now.getDate()
    })
    // 查询所有设置时间的日期
      url: app.globalData.edition + '/teacher/get_time',
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          var year = new Date().getFullYear();
          res.data.data.forEach(function (item, index) {
            var start_time = (new Date(item.start_at * 1000)).toString();
            var monthDay = new Date(item.date_at * 1000).getMonth() + 1 + '' + new Date(item.date_at * 1000).getDate();
            start_time = start_time.split(' ')[4].substring(0, 5);
            _self.bianli(year + '' + monthDay, start_time);
          })
        }
      }
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    var dateArr = [];                       //需要遍历的日历数组数据
    var arrLen = 0;                         //dateArr的数组长度
    var now = setYear ? new Date(setYear, setMonth) : new Date();
    var year = setYear || now.getFullYear();
    var nextYear = 0;
    var month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    var nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    var startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                          //目标月1号对应的星期
    var dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    var obj = {};
    var num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (var i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        var ops = (month + 1)+"-"+num;
        var state = this.data.dateArray.indexOf(ops);
        obj = {
          isToday: (month + 1) +"-"+ num,
          dateNum: num < 10 ? '0'+ num:num,
          weight: 5,
          canSelect: state == -1 ? false : true,
          year: new Date().getFullYear()
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth() + 1;
    var nowWeek = nowDate.getDay();
    var getYear = setYear || nowYear;
    var getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    var year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    var month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    var year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    var month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  clickDate: function(event){
    var _self = this;
    var state = event.currentTarget.dataset.state;
    var witch = event.currentTarget.dataset.date;
    var dateat = event.currentTarget.dataset.dateat;
    this.setData({ witchDay: this.data.dateArray.indexOf(witch)})
    
    if (state) {
      this.setData({ istrue: true })
    }
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
  selectTime: function (event) {
    var _that = this
    var index = event.currentTarget.dataset.index;
    var arr = _that.data.arr;
    var witchPart = _that.data.witchPart;
    var witchDay = _that.data.witchDay;
    // 给选中的时间段添加选中状态
    var a = witchPart[witchDay].indexOf(index);
    if (a == -1) {
      witchPart[witchDay].push(index);
      arr[witchDay][index].isSelect = true; 
    } else {
      witchPart[witchDay].splice(a, 1);
      arr[witchDay][index].isSelect = false;
    }
    this.setData({ arr: arr })
  },
  submit: function(){
    var _self = this;
    var arr = _self.data.arr;
    var witchPart = _self.data.witchPart;
    var witchDay = _self.data.witchDay;
    witchPart[witchDay].sort(function (x, y) {
      return x - y;
    });
    var timeArr = [];
    arr[witchDay].forEach(function(item,index){
      if(witchPart[witchDay].indexOf(index) != -1){
        console.log(item)
        timeArr.push({ start_at: item.date_at + ' ' + item.start_at, end_at: item.date_at + ' ' +item.end_at});
      }
    })
    wx.request({
      url: app.globalData.edition + '/teacher/set_time',
      method: 'post',
      data: {
        date_at: arr[witchDay][0].date_at,
        arr: timeArr
      },
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res.data)
        if (!res.data.message) {
          
        }
      }
    })
    this.setData({
      istrue: false
    })
  },
  bianli: function (monthDay, hour) {
    var arr = this.data.arr;
    var witchPart = this.data.witchPart;
    arr.forEach(function(item,index){
      item.forEach(function(a,b){
        if(a.date_at == monthDay && hour == a.start_at){
          a.isSelect = true;
          witchPart[index].push(b);
        }
      })
    })    
    this.setData({witchPart:witchPart,arr:arr})
  },
  nextDay: function getNextDate(date, day) {
    var dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "" + m + "" + d;
  }
})