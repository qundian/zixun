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
    timeList: ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-24:00']
  },
  onLoad: function(){
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
    var addArr = this.data.witchPart;
    for (var i = 0; i < 30; i++) {
      var time = [];
      for (var z = 0; z < 16; z++) {
        var obj = {
          part: timeList[z],
          state: true,
          isSelect: false
        }
        time.push(obj);
      }
      arr.push(time);
      addArr.push([]);
      var month = (now.getMonth() + 1) //now.getMonth()
      var date = (month + "-" + now.getDate());
      if (date == '12-31') {
        prev = '12-31';

      } else if (prev == '12-31') {
        month = 1;
      }
      dataTitle[i] = (month + "-" + now.getDate());
      now = addDate(month + "/" + now.getDate() + "/" + now.getFullYear(), 1);
    }
    this.setData({ dateArray: dataTitle, arr: arr, witchPart: addArr})
    console.log(arr)

    // 日历相关代码
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday:  month +"-"+ now.getDate()
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
          dateNum: num,
          weight: 5,
          canSelect: state == -1 ? false : true
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
    var state = event.currentTarget.dataset.state;
    var witch = event.currentTarget.dataset.date;
    this.setData({ witchDay: this.data.dateArray.indexOf(witch)})
    if(state){
      this.setData({istrue:true})
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
      arr[witchDay][index].isSelect = 1; 
    } else {
      witchPart[witchDay].splice(a, 1);
      arr[witchDay][index].isSelect = 2;
    }
    this.setData({ arr: arr })
  }
})