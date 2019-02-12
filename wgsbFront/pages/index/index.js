//index.js
//获取应用实例
const app = getApp();
const common = require('../../utils/js/common.js');
const cartRest = require('../../utils/js/cartStorage.js');
Page({
    data: {
        imgUrls: [
            '/img/slider/slider2.png',
            '/img/slider/slider2.png',
            '/img/slider/slider3.png'
        ],
        s1: {
            indicatorDots: true,
            vertical: false,
            autoplay: true,
            circular: true,
            interval: 3000,
            duration: 500,
            previousMargin: 0,
            nextMargin: 0
        },
        discountInfos: [
            '满99减20',
            '满69减10',
            '满39减5'
        ],
        s2: {
            indicatorDots: false,
            vertical: true,
            autoplay: true,
            circular: true,
            interval: 2000,
            duration: 500,
            previousMargin: 0,
            nextMargin: 0
        },
        goods: [],
        ball: {
            hidden: true,
            x: 0,
            y: 0
        },
        cart: [],
        totalPay: 0,
        lowestPay: 12
    },
    addCart: function (e) {
        let topPoint = {},
            x = e.changedTouches[0].clientX,//点击的位置
            y = e.changedTouches[0].clientY;
        if (y < this.busPos['y']) {
            topPoint['y'] = y - 150;
        } else {
            topPoint['y'] = this.busPos['y'] - 150;
        }
        topPoint['x'] = Math.abs(x - this.busPos['x']) / 2;

        if (x > this.busPos['x']) {
            topPoint['x'] = (x - this.busPos['x']) / 2 + this.busPos['x'];
        } else {
            topPoint['x'] = (this.busPos['x'] - x) / 2 + x;
        }
        let params = [this.busPos, topPoint, {x: x, y: y}];
        this.linePos = common.bezier(params, 30);
        this.startAnimation(e);
    },
    startAnimation: function (e) {
        let that = this,
            points = that.linePos;
        this.setData({
            ball: {
                hidden: false,
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            }
        });
        this.timer = setInterval(function () {
            for (let i = points.length - 1; i > -1; i--) {
                that.setData({
                    'ball.x': points[i].x,
                    'ball.y': points[i].y
                });
                if (i < 1) {
                    clearInterval(that.timer);
                    that.addGoodToCartFn(e);
                    that.setData({
                        'ball.hidden': true
                    })
                }
            }
        }, 25);
    },
    addGoodToCartFn: function (e) {
        let cart = this.data.cart;
        let id = parseInt(e.currentTarget.dataset.id);
        let item = null;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].dishid === id) {
                item = cart[i];
                break;
            }
        }
        if (item) {
            item.quantity++;
        } else {
            cart.push({
                dishid: id,
                quantity: 1,
                selected: true
            })
        }
        this.setData({
            cart: cart
        });
        this.changeCart(cart);
    },
    minusCart: function (e) {
        let cart = this.data.cart;
        let id = parseInt(e.currentTarget.dataset.id);
        let item = null;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].dishid === id) {
                item = cart[i];
                item.quantity--;
                if (item.quantity <= 0) {
                    cart.splice(i, 1);
                }
                break;
            }
        }
        this.setData({
            cart: cart
        });
        this.changeCart(cart);
    },
    changeCart: function (cart) {
        let totalPay = common.getTotalPay(cart, app);
        common.watchTotal(cart);
        common.numberGrow(this, totalPay, "totalPay");
    },
    goPay: function (e) {
        wx.switchTab({
            url: '/pages/cart/cart'
        })
    },
    onHide:function(){
        wx.setStorageSync('cart', this.data.cart);
    },
    payTip: function (e) {
        common.showToastError("您的订单未达起送价！")
    },
    onLoad: function () {
        let _this = this;
        this.page = 0;
        //初始化购物车位置
        this.busPos = {
            x: 45,
            y: app.globalData.systemInfo.windowHeight - 56
        };
        wx.request({
            url: 'https://wmx6.cn/wgsb/dish',
            method: "GET",
            success: function (res) {
                app.globalData.goods = res.data;
                let cart = wx.getStorageSync('cart') || [];
                _this.changeCart(cart);
                _this.setData({
                    goods: res.data,
                    cart: cart
                });
            },
            fail: function (e) {
                common.showToastError("获取商品信息失败");
            }
        })
    },
    onPullDownRefresh:function (e) {
        console.log("刷新！！！");
        console.log(e);
    }
});