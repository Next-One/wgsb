let mysql = require('mysql');
let mysqlConf = require('../conf/mysqlConf');
let orderDetailSqlMap = require('./orderDetailSqlMap');
let pool = mysql.createPool(mysqlConf.mysql);
let log = require('../debugLog');

module.exports = {
    add: function (user_orderDetail_array) {
        pool.query(orderDetailSqlMap.add, user_orderDetail_array, function (error, result) {
            if (error) {
                log.w('orderDetailDAO.js','add: function (user_orderDetail_array,callback)',error.message);
            }else{
                log.d('orderDetailDAO.js','add: function (user_orderDetail_array,callback)',result);
            }
        });
    },
    update: function (id,callback) {
        pool.query(orderDetailSqlMap.update,id, function (error, result) {
            if (error) {
                log.w('orderDetailDAO.js','update: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('orderDetailDAO.js','update: function (id,callback)',result);
                callback(200);
            }
        });
    },
    list: function (openid,callback) {
        pool.query(orderDetailSqlMap.list,openid, function (error, result) {
            if (error) {
                log.w('orderDetailDAO.js','list: function (openid,callback)',error.message);
                callback(error);
            }else{
                callback(result);
            }
        });
    },
    used: function (openid,callback) {
        pool.query(orderDetailSqlMap.used,openid, function (error, result) {
            if (error) {
                log.w('orderDetailDAO.js','used: function (openid,callback)',error.message);
                callback(error);
            }else{
                if(result.length == 0){
                    callback("null");
                }else{
                    callback(result);
                }
            }
        });
    },
    delete: function (id,callback) {
        pool.query(orderDetailSqlMap.delete, id, function (error, result) {
            if (error) {
                log.w('orderDetailDAO.js','delete: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('orderDetailDAO.js','delete: function (id,callback)',result);
                callback(200);
            }
        });
    }
};
