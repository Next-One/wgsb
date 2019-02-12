# 五谷食补

WeChat applet for wgsb---微信小程序五谷食补

## 项目简介

- 开发原因：自家准备开外卖店，与美团小程序多店铺不同的是，这是单店铺项目，相比之下业务逻辑比较简单，适合单人开发
- 开发周期：2018-11-01 至今
- 用户统计：未上线（功能内容超过微信个人开发者的范围）
- 现状：开发停滞中。原因：1.前期没有设计页面模块，以及具体项目功能，之前是想到啥写啥，导致很多页面功能不合理；2.没有真实的业务逻辑驱动开发，更加没有头绪，只能去想象功能点，然后实现。
- 版本：0.0.1
- 技术难度：较难
- 说明：目前先做好前端，然后做小程序
- 项目录屏：[B站地址](https://www.bilibili.com/video/av39835796/)

![demo-gif](README.assets/wgsb.gif)

## 功能介绍

单个店铺的商品外卖小程序。小程序是重前端的项目，页面做好看是很重要的。想要让小程序好看，就要在三个方面下功夫。（1）丰富的图标使用；（2）合理的颜色搭配，（3）平滑的动效设计。做到这三点，其实就比一般的小程序好看很多啦。整体项目主题色要统一，我选的是天蓝色#1fa0fc，所以项目中所有图标都是用这个颜色。主要已实现功能点如下：

1. 首页点单：首页的UI应该是比较美观的，从配色到动画效果都很赞，对不对？配上点击添加购物车时，3个独立动画，减号动态滑出，商品抛物线似的飞进购物车，总金额的动态累加，整体用户体验较好。用户在总金额大于起送价时，可以进入购物车界面。
2. 套餐分类：对商品的typeid进行分类，方便用户查找喜欢的商品，是外卖类app必有的一个模块。人类都是读图动物，因此在这个商品展示的必须图片很大，而且要好看。这种分类列表的实现，一般是多列瀑布流，由于手机界面比笔记本窄很多，所以2列是比较合理的。
3. 购物车管理：购物车的实现方案有三种：（1）数据库存储，一开始我确实是这样做的，但是测试时发现，这样每次添加购物车都要请求数据库，请求成功才修改前端显示。这样实现用户体验很差，用户添加商品到购物车时会卡顿一下，等待数据库返回，这是几乎不可忍受的，于是我采用了本地存储方案；（2）本地存储，将购物车存储到用户手机上，每次启动小程序时，会读取购物车数据。本地存储虽然比数据库效率提升不少，但是依然存在问题，这里的问题出现在用户频繁修改购物车时，具体是：每次修改购物车，都要同步写到磁盘，如果操作频繁，也会明显感受到卡顿，有人会说这里直接异步同步到磁盘，不要同步使用读写阻塞线程，如果异步的话，就没办法保证数据一致性了。所以有了第三种方式。（3）内存购物车，这种方式最快，修改购物车都是内存操作，不会有任何卡顿。但是这种方案的问题在于，当用户退出小程序，内存中的数据随之消失，下次进入购物车依然为空，没有保存购物车。于是我采用了一个折中方案，将（2）（3）合并。在修改购物车时，直接在内存中操作，不同步到磁盘，在用户退出/页面切换时，才将购物车中的数据同步到磁盘。这样做，既保证了用户体验，又用户购物车数据。
4. 支付页面：将购物车中已选择的订单，计算出价格后展示在界面上。
5. 订单管理：定单的状态设计：1.商家接单/制作中；2.配送中；3.待评价；4.已完成；5.退款
6. 收货地址管理：收货地址可以从微信导入收货地址，也可以从小程序中手动添加，还可以在多个收货地址中设置一个默认的收货地址，就是一些收获地址的CURD操作。
7. 优惠券管理：包含用户获得的优惠卷/红包等，其状态主要分为，已过期，已使用，未使用

## 项目目录

项目分为小程序端代码用Front表示，Node后端代码用Back表示。

### wgsbFront

小程序端代码，需要提交微信审核。具体页面功能如下：

#### 组织结构

```
├── app.json -- 应用配置参数
├── app.js -- 小程序配置 是当前小程序的全局配置，包括了小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等。
├── app.wxss -- 全局样式配置
├── project.config.json -- 项目配置
├── img 小程序用到的图片，部分图片，该项目图片超过2M，小程序不可以超过2M，所以大部分图片在服务器上。
├── page -- 项目页面
│   └── address -- 地址管理
│   └── bonus -- 优惠券管理
│   └── cart -- 购物车 tab页
│   └── classify -- 分类页面 tab页
│   └── dish -- 商品详情（未完成）
│   └── feedback -- 反馈页面（未完成）
│   └── handle -- 订单监控（未完成）
│   └── index -- 首页 tab页
│   └── invite -- 邀请
│   └── lib -- 配合页面渲染的库
│   └── my -- 我的页面 tab页
│   └── order -- 订单
│   └── orderDetail -- 订单详细
│   └── pay -- 支付页面
├── util -- 模块化开发
│   ├── js -- 公用JS代码
│   └── wxml -- 页面间通用wxml，与wxss对应
│   └── wxss -- 页面间通用wxss，与wxml对应
```

### wgsbBack

基于node.js + express + mysql实现的restful风格的小程序后端。

#### 组织结构

```
├── app.js -- 应用配置
├── bin
│   └── www -- 项目运行脚本
├── conf
│   └── mysqlConf.js -- mysql配置文件
├── dao
│   ├── *DAO.js -- 封装*数据库的交互
│   └── *SqlMap.js -- 封装*数据库SQL语句
├── mylogfiles -- 项目日志文件
├── package.json -- 依赖模块
├── sql
│   └── zqCard.sql -- 数据库建表脚本
├── util
│   └── common.js -- 公用js
└── routes
    └── controller.js -- 用户操作路由及业务逻辑
```

