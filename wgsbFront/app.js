const common = require('./utils/js/common.js');
// const cartRest = require('./utils/js/cartStorage.js');
const userRest = require('./utils/js/userRest.js');
App({
    checkOpenid: function () {
        let failTip = "您登录失败，请到设置中重新登录！";
        // 判断用户是否有openid，保证用户登陆
        this.globalData.openid = wx.getStorageSync('openid');
        this.globalData.systemInfo = wx.getStorageSync('systemInfo');

        let that = this;
        if(!this.globalData.systemInfo){
            wx.getSystemInfo({//  获取页面的有关信息
                success: function (res) {
                    wx.setStorageSync('systemInfo', res);
                    that.globalData.systemInfo = res;
                }
            });
        }

        // 用户不存在openid，说明用户可能是第一次登陆
        let _this = this;
        if (this.globalData.openid) {
            common.showToast("成功 get");
            userRest.getReq(this.globalData);
        } else {
            wx.login({
                timeout: 20000,
                success: function (res) {
                    wx.request({
                        url: 'https://wmx6.cn/wgsb/register?code=' + res.code,
                        method: "GET",
                        success: function (response) {
                            let openid = response.data.openid;
                            if (openid) {
                                common.showToast("成功 register");
                                _this.globalData.openid = openid;
                                userRest.getReq(_this.globalData);
                                wx.setStorage({
                                    key: "openid",
                                    data: openid
                                })
                            } else {
                                common.showToastError(response.data.msg);
                            }
                        },
                        fail: function (e) {
                            common.showToastError(failTip);
                        }
                    })
                },
                fail: function (res) {
                    common.showToastError(failTip);
                }
            })
        }
        // cartRest.getCountReq();
    },
    onLaunch: function () {
        // 登录并设置openid
        this.checkOpenid();
    },
    globalData: {
        openid: null,
        systemInfo:null,
        userInfo: {},
        goods: [
            {
            imgUrl: '/img/firut/f1.jpg',
            id: 1,
            name: '苹果',
            brief: '富含矿物质和维生素',
            price: 5,
            type: 1,
            discount: 1,
            praise: 10,
            sum: 20
        },
            {
                imgUrl: '/img/firut/f1.jpg',
                id: 2,
                name: '苹果',
                brief: '富含矿物质和维生素',
                price: 5,
                type: 1,
                discount: 1,
                praise: 10,
                sum: 20
            },
            {
                imgUrl: '/img/firut/f1.jpg',
                id: 3,
                name: '苹果',
                brief: '富含矿物质和维生素',
                price: 5,
                type: 1,
                discount: 0.8,
                praise: 10,
                sum: 20
            }
        ]
    }
});