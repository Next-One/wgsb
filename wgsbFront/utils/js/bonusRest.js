const common = require('./common.js');
const url = "https://wmx6.cn/wgsb/bonus";
module.exports = {
  getReq: function(openid, callBack) {
    wx.request({
      url: url +"/" + openid,
      method: "GET",
      success: function(res) {
        callBack(res.data);
      },
      fail: function(e) {
        common.showToastError("获取红包列表失败");
      }
    })
  },
  getUsedReq: function (openid, callBack) {
    wx.request({
      url: url+"?openid="+openid,
      method: "GET",
      success: function(res) {
        callBack(res.data);
      },
      fail: function(e) {
        common.showToastError("获取红包列表失败");
      }
    })
  },
  postReq: function(data, callBack) {
    let query = common.getQuery(data);
    wx.request({
      url: url + query,
      method: "POST",
      success: function(res) {
        if (res.statusCode === 200) {
          callBack(res.data);
        } else {
          common.showToastError("添加红包失败");
        }
      },
      fail: function(e) {
        common.showToastError("添加红包失败");
      }
    })
  },
  putReq: function(id) {
    wx.request({
      url: url + "?id=" + id,
      method: "PUT",
      success: function(res) {
      },
      fail: function(e) {
      }
    })
  },
  deleteReq: function(id, callBack) {
    wx.request({
      url: url+"/" + id,
      method: "DELETE",
      success: function(res) {
        if (res.statusCode === 200) {
          callBack();
        } else {
          common.showToastError("删除红包失败");
        }
      },
      fail: function(e) {
        common.showToastError("删除红包失败");
      }
    })
  }
}