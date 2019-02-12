let mysql = require('mysql');
let mysqlConf = require('../conf/mysqlConf');
let bonusSqlMap = require('./bonusSqlMap');
let pool = mysql.createPool(mysqlConf.mysql);
let log = require('../debugLog');

module.exports = {
    add: function (user_bonus_array,callback) {
        pool.query(bonusSqlMap.add, user_bonus_array, function (error, result) {
            if (error) {
                log.w('bonusDAO.js','add: function (user_bonus_array,callback)',error.message);
                callback(500);
            }else{
                log.d('bonusDAO.js','add: function (user_bonus_array,callback)',result);
                callback(200);
            }
        });
    },
    update: function (id,callback) {
        pool.query(bonusSqlMap.update,id, function (error, result) {
            if (error) {
                log.w('bonusDAO.js','update: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('bonusDAO.js','update: function (id,callback)',result);
                callback(200);
            }
        });
    },
    list: function (openid,callback) {
        pool.query(bonusSqlMap.list,openid, function (error, result) {
            if (error) {
                log.w('bonusDAO.js','list: function (openid,callback)',error.message);
                callback(error);
            }else{
                callback(result);
            }
        });
    },
    used: function (openid,callback) {
        pool.query(bonusSqlMap.used,openid, function (error, result) {
            if (error) {
                log.w('bonusDAO.js','used: function (openid,callback)',error.message);
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
        pool.query(bonusSqlMap.delete, id, function (error, result) {
            if (error) {
                log.w('bonusDAO.js','delete: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('bonusDAO.js','delete: function (id,callback)',result);
                callback(200);
            }
        });
    }
};
