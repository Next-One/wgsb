const common = require('./common.js');

module.exports = {
    getReq: function (callBack) {
        wx.getStorage({
            key: 'cart',
            success(res) {
                callBack(res.data)
            },
            fail(err) {
                callBack([]);
            }
        })
    },
    getCountReq: function () {
        wx.getStorage({
            key: 'cart',
            success(res) {
                common.watchTotal(res.data);
            }
        })
    },
    postReq: function (data, app) {
        wx.getStorage({
            key: 'cart',
            success(res) {
                let cart = res.data;
                let exists = false;
                for (let i = 0; i < cart.length; i++) {
                    if (cart[i].dishid === data.dishid) {
                        cart[i].quantity += data.quantity;
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    cart.push({
                        dishid: data.dishid,
                        quantity: data.quantity,
                        selected: true
                    })
                }
                wx.setStorage({
                    key: "cart",
                    data: cart,
                    success: function (e) {
                        common.watchTotal(cart);
                    },
                    fail: function (e) {
                        common.showToastError("添加商品到购物车失败");
                    }
                });
            },
            fail: function (e) {
                let cart = [{
                    dishid: data.dishid,
                    quantity: data.quantity,
                    selected: true
                }];
                wx.setStorage({
                    key: "cart",
                    data: cart,
                    success: function (e) {
                        common.watchTotal(cart);
                    },
                    fail: function (e) {
                        common.showToastError("添加商品到购物车失败");
                    }
                });
            }
        })
    },
    putReq: function (_this, cart, app) {
        wx.setStorage({
            key: "cart",
            data: cart,
            success: function (e) {
                let totalPay = common.getTotalPay(cart, app);
                _this.setData({
                    cart: cart
                });
                common.numberGrow(_this, totalPay, "totalPay");
                common.watchTotal(cart);
            },
            fail: function (e) {
                common.showToastError("修改购物车失败");
            }
        });
    }
};