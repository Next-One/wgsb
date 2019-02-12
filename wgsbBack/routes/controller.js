const express = require('express'),
    router = express.Router(),
    userDAO = require('../dao/userDAO'),
    dishDAO = require('../dao/dishDAO'),
    bonusDAO = require('../dao/bonusDAO'),
    orderInfoDAO = require('../dao/orderInfoDAO'),
    orderDetailDAO = require('../dao/orderDetailDAO'),
    addressDAO = require('../dao/addressDAO'),
    common = require('../util/common'),
    request = require('request'),
    log = require('../debugLog'),
    multipart = require('connect-multiparty'),
    fs = require('fs'),// 载入fs模块
    multipartMiddleware = multipart();
const wxURL = 'https://api.weixin.qq.com/sns/jscode2session',
    appID = '?appid=wx1f4bc8bfe8f8396e',
    SECRET = '&secret=7b2cc4e694c667039ee32a0a288d9846',
    jscode = '&js_code=',
    auth = '&grant_type=authorization_code';


/* user 注册 生成openid 返回给客户端 */
router.get('/wgsb/register', function (req, res) {
    let code = req.query.code;
    let url = wxURL + appID + SECRET + jscode + code + auth;
    log.d('controller', '/register', 'url=' + url);
    request(url, function (error, response, query) {
        if (!error && response.statusCode === 200) {
            let json = JSON.parse(query);
            let openid = json.openid;
            let nickName = "yh" + new Date().getTime();
            userDAO.add([openid, nickName, nickName], function (result) {
                if (result === 200) {
                    res.send({
                        openid: openid
                    });
                } else {
                    res.send({
                        err: result
                    });
                }
            });
        } else {
            log.w('controller', '/register', 'resultMap=' + resultMap);
        }
    })
});


// user表 RESTful CURD操作
router.get('/wgsb/user/:openid', function (req, res) {
    let openid = req.params.openid;
    log.d('controller', '/user/get', 'openid=' + openid);
    userDAO.get(openid, function (result) {
        res.send(result);
    });
});

router.post('/wgsb/user', function (req, res) {
    let openid = req.query.openid;
    let nickName = req.query.nickName;
    log.d('controller', '/user/post', 'openid=' + openid);
    userDAO.add([openid, nickName, nickName], function (result) {
        if (result === 200) {
            res.send({
                openid: openid
            });
        } else {
            res.send({
                err: result
            });
        }
    });
});

router.put('/wgsb/user', function (req, res) {
    let openid = req.query.openid;
    let addressid = req.query.addressid;
    if (addressid) {
        userDAO.updateAddress([addressid, openid], function (result) {
            res.sendStatus(result);
        });
    } else {
        let nickName = req.query.nickName;
        let avatarUrl = req.query.avatarUrl;
        let province = req.query.province;
        let gender = req.query.gender;
        let city = req.query.city;
        userDAO.update([nickName, avatarUrl, province, gender, city, openid], function (result) {
            res.sendStatus(result);
        });
    }
});


// dish RESTful CURD操作
router.get('/wgsb/dish', function (req, res) {
    log.d('controller', '/dish', '');
    let callback = req.query.callback;
    //有回调表示jsonp
    if(callback){
        dishDAO.list(function (result) {
            let json = JSON.stringify(result);
            //模拟函数调用
            let fn = callback+"("+json+")";
            res.send(fn);
        });
    }else{
        dishDAO.list(function (result) {
            res.send(result);
        });
    }
});

// address RESTful CURD操作

router.get('/wgsb/address/:openid', function (req, res) {
    let openid = req.params.openid;
    log.d('controller', '/address/get', 'openid=' + openid);
    addressDAO.list(openid, function (result) {
        res.send(result);
    });
});

router.get('/wgsb/address', function (req, res) {
    let id = req.query.id;
    log.d('controller', '/address/get', 'id=' + id);
    addressDAO.one(id, function (result) {
        res.send(result);
    });
});

router.post('/wgsb/address', function (req, res) {
    let openid = req.query.openid;
    let userName = req.query.userName;
    let phoneNum = req.query.phoneNum;
    let region = req.query.region;
    let detail = req.query.detail;
    let array = [openid, userName, phoneNum, region, detail];
    log.d('controller', '/address/post', array);
    addressDAO.add(array, function (result) {
        if (result === 500) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
            userDAO.updateAddress([result, openid], function (r) {});
        }
    });
});

router.put('/wgsb/address', function (req, res) {
    let id = req.query.id;
    let userName = req.query.userName;
    let phoneNum = req.query.phoneNum;
    let region = req.query.region;
    let detail = req.query.detail;
    let array = [userName, phoneNum, region, detail, id];
    log.d('controller', '/address/put', array);
    addressDAO.update(array, function (result) {
        res.sendStatus(result);
    });

});

router.delete('/wgsb/address/:id', function (req, res) {
    let id = req.params.id;
    log.d('controller', '/address', id);
    addressDAO.delete(id, function (result) {
        res.sendStatus(result);
    });
});


// bonus RESTful CURD操作

router.get('/wgsb/bonus/:openid', function (req, res) {
    let openid = req.params.openid;
    log.d('controller', '/bonus/get', 'openid=' + openid);
    bonusDAO.list(openid, function (result) {
        res.send(result);
    });
});

router.get('/wgsb/bonus', function (req, res) {
    let openid = req.query.openid;
    log.d('controller', '/bonus/get', 'openid=' + openid);
    bonusDAO.used(openid, function (result) {
        res.send(result);
    });
});

router.post('/wgsb/bonus', function (req, res) {
    let openid = req.query.openid;
    let useTime = req.query.useTime;
    let lowest = req.query.lowest;
    let money = req.query.money;
    let type = req.query.type;
    let array = [openid, useTime, lowest, money, type];
    log.d('controller', '/bonus/post', array);
    bonusDAO.add(array, function (result) {
        if (result === 500) {
            res.sendStatus(result);
        } else {
            res.sendStatus(200);
        }
    });
});

router.put('/wgsb/bonus', function (req, res) {
    let id = req.query.id;
    log.d('controller', '/bonus/put', id);
    bonusDAO.update(id, function (result) {
        res.sendStatus(result);
    });

});

router.delete('/wgsb/bonus/:id', function (req, res) {
    let id = req.params.id;
    log.d('controller', '/bonus/delete', id);
    bonusDAO.delete(id, function (result) {
        res.sendStatus(result);
    });
});

// orderInfo RESTful CURD操作

router.get('/wgsb/orderInfo/:openid', function (req, res) {
    let openid = req.params.openid;
    log.d('controller', '/orderInfo/get', 'openid=' + openid);
    orderInfoDAO.list(openid, function (result) {
        res.send(result);
    });
});

router.get('/wgsb/orderInfo', function (req, res) {
    let orderid = req.query.orderid;
    log.d('controller', '/orderInfo/get', 'orderid=' + orderid);
    orderInfoDAO.used(orderid, function (result) {
        res.send(result[0]);
    });
});

router.post('/wgsb/orderInfo', multipartMiddleware, function (req, res) {
    // console.log(req);
    let data = req.body;
    let orderid = common.getOrderNum();
    let openid = data.address.openid;
    let bestTime = data.bestTime;
    let orderItems = data.order;
    let orderItemsStr = JSON.stringify(orderItems);
    if (!bestTime) {
        bestTime = new Date();
    }
    const order_array = [
        orderid,
        openid,
        data.address.userName,
        data.address.phoneNum,
        data.address.region,
        data.address.detail,
        data.orderInfo.allMinus,
        data.orderInfo.allPrice,
        data.orderInfo.fullMinus,
        data.orderInfo.packageFee,
        data.orderInfo.sendFee,
        data.orderInfo.minusSendFee,
        data.orderInfo.redPackage,
        bestTime,
        data.orderDetail.comment,
        data.orderDetail.orderStatus,
        data.orderDetail.payStatus,
        data.orderDetail.payType,
        data.orderDetail.sendType,
        data.orderDetail.tableware,
        data.bonusid.money,
        orderItemsStr
    ];
    orderInfoDAO.add(order_array, function (result) {
        if (result === 200) {
            res.sendStatus(result);
            orderItems.forEach(item => {
                orderDetailDAO.add([orderid, openid, item.id, item.quantity, item.price, item.discount, item.name, item.imgUrl]);
            });
        } else {
            res.sendStatus(result);
        }
    });
});

router.put('/wgsb/orderInfo', function (req, res) {
    let data = req.query.data;
    log.d('controller', '/orderInfo/put', data);
    orderInfoDAO.update(data, function (result) {
        res.sendStatus(result);
    });
});

router.delete('/wgsb/orderInfo/:id', function (req, res) {
    let id = req.params.id;
    log.d('controller', '/orderInfo/delete', id);
    orderInfoDAO.delete(id, function (result) {
        res.sendStatus(result);
    });
});


router.post('/wgsb/submit', function (req, res) {
    console.log(req.query);
    console.log(req.body);
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.sendStatus(200);
});

router.get('/wgsb/submit', function (req, res) {
    console.log(req.query);
    console.log(req.body);
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.send({
        name:'wmx',
        age:22
    });
});

router.get('/wgsb/test', function (req, res) {
    console.log(req.query);
    console.log(req.body);
    // res.setHeader("Access-Control-Allow-Origin",'*');
    res.send({
        name:'wmx',
        age:22
    });
});

router.post('/wgsb/upload', multipartMiddleware, function (req, res, next) {
    const myfile = req.files.myfile;
    let des_file = __dirname + "/upload/" + myfile.originalFilename;
    fs.readFile(myfile.path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                let response = {
                    message: 'File uploaded successfully',
                    filename: myfile.originalFilename
                };
                console.log(response);
                res.send(JSON.stringify(response));
            }

        });
    });
});

module.exports = router;