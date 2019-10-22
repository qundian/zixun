var app = getApp();
Page({
 data: {
   status: app.globalData.status,
   user:{
     name: '陈春花', price: 300, time: '2019-10-02 6:00-8:00', long: 45, content:'缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来'
   },
   gradeImg: [
     '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png', '/images/xx.png'
   ],  //评分图片
   manner: 0, //态度
   major: 0, //专业
   satisfied: 0 //满意
  },
  costAdd: function(event){
    var index = event.currentTarget.dataset.index;
    var name = event.currentTarget.dataset.name;
    var manner = this.data.manner;
    var major = this.data.major;
    var satisfied = this.data.satisfied;
    if(name == 'manner'){
      this.setData({ manner: manner+index+1})
    }else if(name == 'major'){
      this.setData({ major: major + index + 1 })
    }else{
      this.setData({ satisfied: satisfied + index + 1 })
    }
  },
  costSub: function (event) {
    var index = event.currentTarget.dataset.index;
    var name = event.currentTarget.dataset.name;
    var manner = this.data.manner;
    var major = this.data.major;
    var satisfied = this.data.satisfied;
    if (name == 'manner') {
      this.setData({ manner: index+1 })
    } else if (name == 'major') {
      this.setData({ major: index + 1 })
    } else {
      this.setData({ satisfied: index + 1 })
    }
  }
})