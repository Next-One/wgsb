const common = require('./common.js');
const url = "https://wmx6.cn/wgsb/user";
module.exports = {
  getReq: function(app) {
    wx.request({
      url: url + "/" + app.openid,
      method: "GET",
      success: function(res) {
        let userInfo = res.data;
        if(userInfo.openid){
          app.userInfo=userInfo;
        }else{
          common.showToastError("获取用户信息失败");
        }
      },
      fail: function(e) {
        common.showToastError("获取用户信息失败");
      }
    })
  },
  putReq: function(data, callBack) {
    let query = common.getQuery(data);
    let that = this;
    wx.request({
      url: url + query,
      method: "PUT",
      success: function (res) {
        if (res.statusCode === 200) {
          callBack(data);
        } else {
          common.showToastError("修改信息失败");
        }
      },
      fail: function (e) {
        common.showToastError("修改信息失败");
      }
    })
  },
  putUserInfoReq: function (data,callBack) {
    let query = common.getQuery(data);
    wx.request({
      url: url + query,
      method: "PUT",
      success: function (res) {
        if (res.statusCode === 200) {
          callBack(data);
        } else {
          common.showToastError("修改信息失败");
        }
      },
      fail: function (e) {
        common.showToastError("修改信息失败");
      }
    })
  }

}