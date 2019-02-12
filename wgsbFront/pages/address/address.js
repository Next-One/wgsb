// pages/address/address.js
const common = require('../../utils/js/common.js');
const addressRest = require('../../utils/js/addressRest.js');
const userRest = require('../../utils/js/userRest.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressid: null,
    address: [],
    modal: {
      edit: true,
      hidden: true
    },
    form: {
      userName: '',
      phoneNum: '',
      region: ["安徽省", "合肥市", "蜀山区"],
      detail: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  changeRegion(e) {
    this.setData({
      'form.region': e.detail.value
    });
  },
  cancel: function(e) {
    this.setData({
      'modal.hidden': true
    })
  },
  manual: function(e) {
    this.setData({
      modal: {
        edit: false,
        hidden: false
      },
      form: {
        userName: '',
        phoneNum: '',
        region: ["安徽省", "合肥市", "蜀山区"],
        detail: ''
      }
    });
  },
  changeLastPage: function(idx) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.route.indexOf("pay") != -1) {
      prevPage.setData({
        address: this.data.address[idx]
      });
    }
  },
  select: function(e) {
    let idx = parseInt(e.currentTarget.dataset.idx);
    let data = this.data.address[idx];
    this.changeLastPage(idx);
    this.setData({
      addressid: data.id
    });
  },
  getWXAddress: function(e) {
    let _this = this;
    wx.authorize({
      scope: "scope.address",
      success: function(res) {
        wx.chooseAddress({
          success: function(data) {
            addressRest.postWXReq({
              region: data.provinceName + " " + data.cityName + " " + data.countyName,
              phoneNum: data.telNumber,
              userName: data.userName,
              detail: data.detailInfo,
              openid: app.globalData.openid
            }, (data) => {
              addressRest.getReq(app.globalData.openid, (address) => {
                if (address.length > 0) {
                  _this.setData({
                    address: address,
                    addressid: address[0].id
                  });
                  _this.changeLastPage(0);
                }
              });
            });
          }
        })
      },
      fail: function(e) {
        wx.openSetting({
          success(res) {
            if (res.authSetting["scope.address"]) {
              common.showToast("再次点击获取微信地址")
            } else {
              common.showToastError("获取权限失败")
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  saveAddress: function(e) {
    let form = e.detail.value;
    let result = common.formCheck(form);
    let edit = this.data.modal.edit;
    this.setData({
      "modal.hidden": true
    });
    if (result.code) {
      common.showToastError(result.msg);
    } else {
      form.openid = app.globalData.openid;
      if (edit) {
        form.id = this.data.form.id;
        addressRest.putReq(form, () => {
          let idx = this.data.modal.idx;
          let item = this.data.address[idx];
          let key = "address[" + idx + "]";
          this.setData({
            [key]: form
          });
          this.changeLastPage(idx);
        });
      } else {
        addressRest.postReq(form, () => {
          addressRest.getReq(app.globalData.openid, (address) => {
            if (address.length > 0) {
              this.setData({
                address: address,
                addressid: address[0].id
              });
              this.changeLastPage(0);
            }
          })
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    addressRest.getReq(app.globalData.openid, (address) => {
      this.setData({
        address: address,
        addressid: app.globalData.userInfo.addressid
      });
    });
  },
  deleteAddress: function(e) {
    let _this = this;
    wx.showModal({
      title: '确定删除这个地址？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          let idx = parseInt(e.currentTarget.dataset.idx);
          let address = _this.data.address;
          let id = address[idx].id;
          address.splice(idx, 1);
          addressRest.deleteReq(id, () => {
            _this.setData({
              address: address
            })
          });
        }
      }
    });
  },
  editAddress: function(e) {
    let idx = parseInt(e.currentTarget.dataset.idx);
    let address = this.data.address;
    let item = address[idx];
    // 深拷贝问题
    if (typeof item.region === 'string') {
      let region = item.region.split(" ");
      item.region = region;
    }
    this.setData({
      form: item,
      modal: {
        idx: idx,
        edit: true,
        hidden: false
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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