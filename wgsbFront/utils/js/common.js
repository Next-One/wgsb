module.exports = {

    bezier: function (pots, amount) {
        let pot;
        let lines;
        let ret = [];
        let points;
        for (let i = 0; i <= amount; i++) {
            points = pots.slice(0);
            lines = [];
            while (pot = points.shift()) {
                if (points.length) {
                    lines.push(pointLine([pot, points[0]], i / amount));
                } else if (lines.length > 1) {
                    points = lines;
                    lines = [];
                } else {
                    break;
                }
            }
            ret.push(lines[0]);
        }
        function pointLine(points, rate) {
            let pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
            pointA = points[0];//点击
            pointB = points[1];//中间
            xDistance = pointB.x - pointA.x;
            yDistance = pointB.y - pointA.y;
            pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
            tan = yDistance / xDistance;
            radian = Math.atan(tan);
            tmpPointDistance = pointDistance * rate;
            return {
                x: pointA.x + tmpPointDistance * Math.cos(radian),
                y: pointA.y + tmpPointDistance * Math.sin(radian)
            };
        }
        return ret;
    },

  getOrderNum: function() {
    //订单号
    let orderNum = "";
    //6位随机数，用以加在时间戳后面。
    for (let i = 0; i < 3; i++) {
      orderNum += Math.floor(Math.random() * 10);
    }
    //时间戳，用来生成订单号。
    return new Date().getTime() + orderNum;
  },

  // 根据订单生成相应的订单信息 orderInfo
  orderHandle: function(order, callBack) {

    // 包装费
    let packageFee = 0;
    // 配送费
    let sendFee = 3.5;
    // 减配送费
    let minusSendFee = 2.5;
    // 返现红包
    let redPackage = 0;
    // 满减
    let fullMinus = 0;
    // 总减价
    let allMinus = 0;
    // 总价
    let allPrice = 0;
    // 总数量 用于计算包装费
    let allQuantity = 0;

    order.forEach(item => {
      allQuantity += item.quantity;
      allPrice += item.price * item.discount * item.quantity;
    });
    // 返现红包
    if (allPrice >= 30) {
      redPackage = 3;
    } else if (allPrice >= 20) {
      redPackage = 2;
    } else if (allPrice >= 12) {
      redPackage = 1;
    }
    // 计算包装费
    packageFee = allQuantity * 0.25;
    packageFee = packageFee > 2 ? 2 : packageFee;
    // 计算满减

    if (allPrice >= 60) {
      fullMinus = 14;
    } else if (allPrice >= 40) {
      fullMinus = 8;
    } else if (allPrice >= 26) {
      fullMinus = 4;
    }
    allMinus = fullMinus + minusSendFee;
    allPrice = allPrice + sendFee + packageFee - allMinus;

    callBack({
      packageFee: packageFee,
      sendFee: sendFee,
      minusSendFee: minusSendFee,
      redPackage: redPackage,
      fullMinus: fullMinus,
      allMinus: allMinus,
      allPrice: allPrice
    }, order);
  },
  getTotalPay: function(cart, app) {
    let totalPay = 0;
    let goods = app.globalData.goods;
    cart.forEach(item => {
      if (item.selected) {
        let good = {};
        for (let i = 0; i < goods.length; i++) {
          if (goods[i].id === item.dishid) {
            good = goods[i];
            break;
          }
        }
        totalPay += good.price * good.discount * item.quantity;
      }
    });
    return totalPay;
  },
  formCheck: function(form) {
    for (let a in form) {
      if (a !== 'region' && !form[a].trim()) {
        return {
          code: true,
          msg: "地址信息有空白，无法保存"
        };
      }
    }
    if (form.phoneNum.trim().length !== 11) {
      return {
        code: true,
        msg: "手机号不是11位"
      };
    }
    return {
      code: false,
      msg: ""
    };
  },
  getQuery: function(data) {
    let query = "?";
    for (let attr in data) {
      query += attr + "=" + data[attr] + "&";
    }
    let len = query.length - 1;
    return query.substring(0, len);
  },
  watchTotal: function(cart) {
    let total = 0;
    cart.forEach(item => {
      total += item.quantity;
    });
    if (total > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: total + ''
      });
    } else {
      wx.removeTabBarBadge({
        index: 2
      });
    }
  },
  showToast: function(title) {
    wx.showToast({
      title: title,
      mask: true,
      duration: 800
    });
  },
  showToastError: function(title) {
    wx.showToast({
      title: title,
      mask: true,
      duration: 1500,
      icon: "none"
    });
  },
  numberGrow: function(_this, curValue, prop) {
    let basecurValue = _this.data[prop]; //原数字
    let difference = curValue - basecurValue; //与原数字的差
    if (difference === 0) {
      return;
    }
    let changeUnit = (difference / 6).toFixed(2); //绝对差除以变化次数
    for (let i = 0; i < 6; i++) {
      // 使用闭包传入i值，用来判断是不是最后一次变化
      (function(i) {
        setTimeout(() => {
          let add = (basecurValue + changeUnit * i).toFixed(2);
          _this.setData({
            [prop]: add
          });
          // 最后一步要精确设置新数字
          if (i === 5) {
            _this.setData({
              [prop]: curValue
            })
          }
        }, 60 * (i + 1))
      })(i)
    }
  }
};