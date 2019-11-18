var app = getApp();
Page({
  data: {
    arr: [],
    isTeacher: false,
    nowPage: 1,
    allPage: 1,
    getMore: ['点击加载更多']
  },
  onLoad: function(){
    this.setData({
      slideButtons: [{
        type: 'warn',
        text: '删除',
        extClass: 'test'
      }],
    });

    var _self = this;
    var userInfo = wx.getStorageSync('userInfo');
    var token = wx.getStorageSync('token');
    if (userInfo && token) {
      // 判断身份
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
  },
  onShow: function(){
    this.getList();
  },
  onHide: function () {
    this.setData({ arr: [], nowPage: 1, allPage: 1, getMore: ['点击加载更多'] })
  },
  slideButtonTap(event) {
    var _self = this;
    var id = event.currentTarget.dataset.id;
    var arr = this.data.arr;
    wx.request({
      url: app.globalData.edition + '/message/deleteMsg?id=' + id,
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        if(res.data == 1){
          arr.forEach(function(item,index){
            if(item.id == id){
              arr.splice(index, 1);
            }
          })
          _self.setData({arr:arr});
          wx.showToast({
            title: '删除成功~',
          })
        }
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  },
  getList: function(){
    var _self = this;
    var arr = this.data.arr;
    var nowPage = this.data.nowPage;
    if(this.data.getMore[0] == '点击加载更多'){
      wx.request({
        url: app.globalData.edition + '/message/list?page=' + nowPage,
        method: 'get',
        dataType: "json",
        header: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
        },
        success: function (res) {
          if(res.data.data){
            res.data.data.forEach(function(item,index){
              arr.push(item)
            })
            nowPage++;
            if (nowPage > res.data.last_page) {
              nowPage = res.data.last_page;
              var arrs = [];
              arrs[0] = '已全部加载';
              _self.setData({getMore: arrs})
            }
            _self.setData({ arr: arr, allPage: res.data.last_page, nowPage: nowPage});
          }
        },
        complete: function (res) {
          app.warning(res);
        }
      })
    }else{
      wx.showToast({
        title: '已全部加载',
      })
    }
  },
  delAll: function (event) {
    wx.request({
      url: app.globalData.edition + '/message/delete',
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res)
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  },
  readyAll: function (event){
    wx.request({
      url: app.globalData.edition + '/message/markAsReadForAll',
      method: 'get',
      dataType: "json",
      header: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': wx.getStorageSync('token') ? `Bearer ${wx.getStorageSync('token')}` : ''
      },
      success: function (res) {
        console.log(res)
      },
      complete: function (res) {
        app.warning(res);
      }
    })
  }
})