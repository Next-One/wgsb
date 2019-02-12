// pages/my/my.js
const common = require('../../utils/js/common.js');
// const userRest = require('../../utils/js/userRest.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})