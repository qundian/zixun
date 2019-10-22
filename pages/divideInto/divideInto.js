var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   istrue: false, //时间弹出
   user:{
     name: '张三', position: '主管', price: 300,divide:200,koufei:0, time: '2019-11-12 6:00-7:00',long:45, content:'近日，可口可乐公司推出全球首款由海洋回收废塑料制成的饮料瓶。第一批塑料瓶共300个，原料中25%的塑料来自志愿者在西班牙和葡萄牙收集的海洋垃圾。从2020年开始，该公司计划在可乐瓶中推广这种回收材料'
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
})