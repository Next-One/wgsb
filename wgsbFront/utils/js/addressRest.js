const common = require('./common.js');
const url = "https://wmx6.cn/wgsb/address";
module.exports = {
  getReq: function(openid, callBack) {
    wx.request({
      url: url + "/" +openid,
      method: "GET",
      success: function(res) {
        callBack(res.data);
      },
      fail: function(e) {
        common.showToastError("获取地址失败");
      }
    })
  },
  getOneReq: function (appData, _this) {
    if (appData.userInfo.addressid){
      wx.request({
        url: url,
        data: {
          id: appData.userInfo.addressid
        },
        method: "GET",
        success: function (res) {
          let address = res.data;
          if (address != 'null') {
            _this.setData({
              address: address
            });
          }
        },
        fail: function (e) {
          common.showToastError("获取地址失败");
        }
      })
    }
  },
  postReq: function(data, callBack) {
    let region = data.region;
    region = region[0] + " " + region[1] + " " + region[2];
    data.region = region;
    let query = common.getQuery(data);
    wx.request({
      url: url + query,
      method: "POST",
      success: function(res) {
        if (res.statusCode === 200) {
          callBack();
        } else {
          common.showToastError("新增地址失败");
        }
      },
      fail: function(e) {
        common.showToastError("新增地址失败");
      }
    })
  },
  postWXReq: function (address, callBack) {
    let query = common.getQuery(address);
    wx.request({
      url: url + query,
      method: "POST",
      success: function (res) {
        if (res.statusCode === 200) {
          callBack(address);
        } else {
          common.showToastError("新增地址失败");
        }
      },
      fail: function (e) {
        common.showToastError("新增地址失败");
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