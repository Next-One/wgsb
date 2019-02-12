const common = require('../../utils/js/common.js');
const cartRest = require('../../utils/js/cartStorage.js');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        lowestPay: 12,
        totalPay: 0,
        cart: [],
        goods: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            goods: app.globalData.goods
        })
    },

    goPay: function (e) {
        wx.navigateTo({
            url: '/pages/pay/pay'
        })
    },
    payTip: function (e) {
        common.showToastError("您的订单未达起送价！")
    },
    plus: function (e) {
        let idx = parseInt(e.currentTarget.dataset.idx);
        let cart = this.data.cart;
        let item = cart[idx];
        item.quantity++;
        cartRest.putReq(this, cart, app);
    },
    minus: function (e) {
        let idx = parseInt(e.currentTarget.dataset.idx);
        let cart = this.data.cart;
        let item = cart[idx];
        let _this = this;
        item.quantity--;
        if (item.quantity > 0) {
            cartRest.putReq(this, cart, app);
        } else {
            wx.showModal({
                title: '确定将此商品移除购物车？',
                content: '',
                success: function (res) {
                    if (res.confirm) {
                        cart.splice(idx, 1);
                        cartRest.putReq(_this, cart, app);
                        common.showToast("移除成功");
                    }
                }
            })
        }
    },
    select: function (e) {
        let idx = parseInt(e.currentTarget.dataset.idx);
        let cart = this.data.cart;
        let selected = cart[idx].selected;
        cart[idx].selected = !selected;
        cartRest.putReq(this, cart, app);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        cartRest.getReq(cart => {
            if (cart.length > 0) {
                let totalPay = common.getTotalPay(cart, app);
                common.watchTotal(cart);
                this.setData({
                    cart: cart
                });
                common.numberGrow(this, totalPay, "totalPay");
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});