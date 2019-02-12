const app = getApp();
Page({
    data: {
        goods: [],
        tabs: ['全部', '水果拼盘', '美味汤煲', '营养米粥', '食疗套餐'],
        currentTab: 0,
        scrollLeft: 0,
        dishIndex:-1
    },

    addCart: function (e) {
        let idx = parseInt(e.currentTarget.dataset.idx);
        this.setData({
            dishIndex :idx
        })
    },
    switchTab(e) {
        let cur = e.detail.current ? e.detail.current : e.currentTarget.dataset.current;
        cur = cur ? parseInt(cur) : 0;
        this.setData({
            currentTab: cur
        });
    },

    onLoad: function () {
        this.setData({
            goods: app.globalData.goods
        })
    }
});