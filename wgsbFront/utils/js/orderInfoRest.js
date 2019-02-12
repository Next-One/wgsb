const common = require('./common.js');
const url = "https://wmx6.cn/wgsb/orderInfo";
module.exports = {
  getReq: function(openid, callBack) {
    wx.request({
      url: url + "/" +openid,
      method: "GET",
      success: function(res) {
        callBack(res.data);
      },
      fail: function(e) {
        common.showToastError("获取订单列表失败");
      }
    })
  },
  getOneReq: function (orderid, callBack) {
    wx.request({
      url: url+"?orderid=" + orderid,
      method: "GET",
      success: function (res) {
        callBack(res.data);
      },
      fail: function (e) {
        common.showToastError("获取订单信息失败");
      }
    })
  },
  postReq: function (data, callBack) {
    wx.request({
      url: 'https://wmx6.cn/wgsb/orderInfo',
      method: "POST",
      data:data,
      success: function (res) {
        if (res.statusCode === 200) {
          callBack();
        } else {
          common.showToastError("提交订单失败");
        }
      },
      fail: function (e) {
        common.showToastError("提交订单失败");
      }
    })
  },
  putReq: function (data, callBack) {
    let region = data.region;
    region = region[0] + " " + region[1] + " " + region[2];
    data.region = region;
    let query = common.getQuery(data);
    wx.request({
      url: url + query,
      method: "PUT",
      success: function(res) {
        if (res.statusCode === 200) {
          callBack();
        } else {
          common.showToastError("修改地址失败");
        }
      },
      fail: function(e) {
        common.showToastError("修改地址失败");
      }
    })
  },
  deleteReq: function(id, callBack) {
    wx.request({
      url: url + "/" + id,
      method: "DELETE",
      success: function(res) {
        if (res.statusCode === 200) {
          callBack();
        } else {
          common.showToastError("删除地址失败");
        }
      },
      fail: function(e) {
        common.showToastError("删除地址失败");
      }
    })
  }
}