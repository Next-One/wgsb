// pages/pay/pay.js
const addressRest = require('../../utils/js/addressRest.js');
const bonusRest = require('../../utils/js/bonusRest.js');
const orderInfoRest = require('../../utils/js/orderInfoRest.js');
const common = require('../../utils/js/common.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    order: [],
    bonus: [],
    selectedBonus: false,
    orderDetail: {
      tableware: 1,
      payType: 1,
      comment: '',
      sendType: 1,
      payStatus: 2,
      orderStatus: 0
    },
    bonusid: {
      money: 0
    },
    orderInfo: {
      packageFee: 0,
      sendFee: 0,
      minusSendFee: 0,
      redPackage: 0,
      fullMinus: 0,
      allMinus: 0,
      allPrice: 0
    },
    modal: {
      hidden: true
    },
    form: {
      userName: '',
      phoneNum: '',
      region: ["安徽省", "合肥市", "蜀山区"],
      detail: ''
    },
    hidden: {},
    lastX: 0, //滑动开始x轴位置
    lastY: 0, //滑动开始y轴位置
    times: [],
    timeIndex: 0
  },
  initTimes: function() {
    let datetime = new Date();
    let hour = datetime.getHours();
    // 默认准备时间为45分钟
    let min = datetime.getMinutes();
    let times = [];
    for (let i = 0; i < 10; i++) {
      if (i === 0) {
        min += 45;
        if (min >= 60) {
          min -= 60;
          hour += 1;
        }
        let str = min < 10 ? "0" + min : min;
        times.push(hour + ":" + str);
      } else if (i === 1) {
        if (min >= 40) {
          min = 0;
          hour += 1;
          times.push(hour + ":00")
        } else if (min >= 20) {
          min = 40;
          times.push(hour + ":" + min);
        } else {
          min = 20;
          times.push(hour + ":" + min);
        }
      } else {
        min += 20;
        if (min === 60) {
          min = 0;
          hour += 1;
          times.push(hour + ":00")
        } else {
          times.push(hour + ":" + min);
        }
      }
    }
    return times;
  },
  hidden: function(e) {
    this.setData({
      hidden: null
    });
  },
  changeHiddenTime: function(e) {
    this.setData({
      "hidden.time": true
    });
  },
  changeHiddenTableware: function(e) {
    this.setData({
      "hidden.tableware": true
    });
  },
  changeHiddenComment: function(e) {
    this.setData({
      "hidden.comment": true
    });
  },
  //滑动移动事件
  handletouchmove: function (event) {
    let currentX = event.touches[0].pageX;
    let currentY = event.touches[0].pageY;
    let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    //左右方向滑动
    if (tx > 0 && Math.abs(tx) > Math.abs(ty)) {
      this.setData({
        hidden: null
      })
    }
  },
  //滑动开始事件
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY
  },
  selectTimeItem: function(e) {
    this.setData({
      timeIndex: parseInt(e.currentTarget.dataset.idx)
    })
  },
  selectTablewareItem: function(e) {
    this.setData({
      'orderDetail.tableware': parseInt(e.currentTarget.dataset.idx)
    })
  },
  noUsedBonus: function(e) {
    this.setData({
      bonusid: {
        money: 0
      },
      hidden: null
    });
  },
  usedBonus: function(e) {
    this.setData({
      hidden: null
    });
  },

  commentSubmit: function(e) {
    this.setData({
      "orderDetail.comment": e.detail.value.commentArea,
      hidden: null
    });
  },
  wxPay: function(e) {
    if (this.data.address == null) {
      common.showToastError("亲，您还没有选择地址!")
    } else {
      let time = this.data.times[this.data.timeIndex];
      let d = new Date();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      let dateStr = d.getFullYear() + "-" + month + "-" + day + " " + time + ":00";
      orderInfoRest.postReq({
        address: this.data.address,
        order: this.data.order,
        orderInfo: this.data.orderInfo,
        orderDetail: this.data.orderDetail,
        bonusid: this.data.bonusid,
        bestTime: dateStr
      }, () => {
        wx.setStorage({
          key: "cart",
          data: [],
          success: function(e) {}
        });
        wx.navigateTo({
          url: '/pages/handle/handle'
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 初始化送餐时间
    let times = this.initTimes();
    addressRest.getReq(app.globalData.openid, (address) => {
      if (address.length > 0) {
        this.setData({
          address: address[0]
        })
      }
    });
    let goods = app.globalData.goods;
    try {
      let cart = wx.getStorageSync('cart');
      if (cart) {
        let order = [];
        cart.forEach(item => {
          if (item.selected) {
            for (let i = 0; i < goods.length; i++) {
              let good = goods[i];
              if (good.id === item.dishid) {
                order.push({
                  id: item.dishid,
                  name: good.name,
                  imgUrl: good.imgUrl,
                  discount: good.discount,
                  price: good.price,
                  quantity: item.quantity
                });
                break;
              }
            }
          }
        });
        common.orderHandle(order, (res, order) => {
          this.setData({
            order: order,
            orderInfo: res,
            times: times
          })
        });
      }
    } catch (e) {}
  },
  cancel: function(e) {
    this.setData({
      'modal.hidden': true
    })
  },
  saveAddress: function(e) {
    let form = e.detail.value;
    let result = common.formCheck(form);
    this.setData({
      "modal.hidden": true
    });
    if (result.code) {
      common.showToastError(result.msg);
    } else {
      form.openid = app.globalData.openid;
      addressRest.postReq(form, () => {
        this.setData({
          address: form
        })
      });
    }
  },
  selectBonus: function(e) {
    bonusRest.getUsedReq(app.globalData.openid, bonus => {
      this.setData({
        bonus: bonus,
        "hidden.bonus": true
      });
    })
  },
  selectedThisBonus: function(e) {
    let idx = parseInt(e.currentTarget.dataset.idx);
    let bonusid = this.data.bonus[idx];
    let allPrice = this.data.orderInfo.allPrice;
    let lowest = bonusid.lowest;
    if (lowest < allPrice) {
      this.setData({
        bonusid: bonusid
      });
    } else {
      common.showToastError("您没有达到最低使用额度")
    }
  },
  emptyCatch: function(e) {},

  manual: function(e) {
    this.setData({
      modal: {
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  changeRegion(e) {
    this.setData({
      'form.region': e.detail.value
    });
  },
  getWXAddress: function(e) {
    let _this = this;
    wx.authorize({
      scope: "scope.address",
      success: function(res) {
        wx.chooseAddress({
          success: function(data) {
            let address = {
              region: data.provinceName + " " + data.cityName + " " + data.countyName,
              phoneNum: data.telNumber,
              userName: data.userName,
              detail: data.detailInfo,
              openid: app.globalData.openid
            };
            addressRest.postWXReq(address, () => {
              _this.setData({
                address: address
              })
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
  }
})