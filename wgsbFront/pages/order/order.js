// pages/order/order.js
const common = require('../../utils/js/common.js');
const orderInfoRest = require('../../utils/js/orderInfoRest.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    assess: [],
    backPay: [],
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let tab = options.tab;
    if(tab == 4){
      tab = 2;
    }else if(tab == 2){
      tab = 1;
    }else{
      tab = 0;
    }
    orderInfoRest.getReq(app.globalData.openid, (order) => {
      let assess = [];
      let backPay = [];
      order.forEach(item => {
        let orderItem = JSON.parse(item.orderItem);
        item.orderItem = orderItem;
        if (item.orderStatus == 2) {
          assess.push(item);
        } else if (item.orderStatus == 4) {
          backPay.push(item);
        }
      });
      this.setData({
        order: order,
        assess: assess,
        backPay: backPay,
        currentTab:tab
      });
    });
  },
  switchTab(e) {
    if (e.currentTarget.dataset.tab) {
      this.setData({
        currentTab: parseInt(e.currentTarget.dataset.tab)
      });
    } else {
      this.setData({
        currentTab: e.detail.current
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})