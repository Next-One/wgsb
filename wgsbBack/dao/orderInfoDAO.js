let mysql = require('mysql');
let mysqlConf = require('../conf/mysqlConf');
let orderInfoSqlMap = require('./orderInfoSqlMap');
let pool = mysql.createPool(mysqlConf.mysql);
let log = require('../debugLog');

module.exports = {
    add: function (user_orderInfo_array,callback) {
        pool.query(orderInfoSqlMap.add, user_orderInfo_array, function (error, result) {
            if (error) {
                log.w('orderInfoDAO.js','add: function (user_orderInfo_array,callback)',error.message);
                callback(500);
            }else{
                log.d('orderInfoDAO.js','add: function (user_orderInfo_array,callback)',result);
                callback(200);
            }
        });
    },
    update: function (id,callback) {
        pool.query(orderInfoSqlMap.update,id, function (error, result) {
            if (error) {
                log.w('orderInfoDAO.js','update: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('orderInfoDAO.js','update: function (id,callback)',result);
                callback(200);
            }
        });
    },
    list: function (openid,callback) {
        pool.query(orderInfoSqlMap.list,openid, function (error, result) {
            if (error) {
                log.w('orderInfoDAO.js','list: function (openid,callback)',error.message);
                callback(error);
            }else{
                callback(result);
            }
        });
    },
    used: function (openid,callback) {
        pool.query(orderInfoSqlMap.used,openid, function (error, result) {
            if (error) {
                log.w('orderInfoDAO.js','used: function (openid,callback)',error.message);
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
        pool.query(orderInfoSqlMap.delete, id, function (error, result) {
            if (error) {
                log.w('orderInfoDAO.js','delete: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('orderInfoDAO.js','delete: function (id,callback)',result);
                callback(200);
            }
        });
    }
};
