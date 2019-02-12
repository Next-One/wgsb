const mysql = require('mysql'),
    mysqlConf = require('../conf/mysqlConf'),
    userSqlMap = require('./userSqlMap'),
    pool = mysql.createPool(mysqlConf.mysql),
    log = require('../debugLog');

module.exports = {
    add: function (userInfo, callback) {
        pool.query(userSqlMap.add, userInfo, function (error, result) {
            if (error) {
                log.w('userDAO.js', 'add: function (user)', error.message);
                callback(error.message);
            }else{
                callback(200);
            }
        });
    },
    update: function (userInfo, callback) {
        pool.query(userSqlMap.update, userInfo, function (error, result) {
            if (error) {
                log.w('userDAO.js', 'update: function (userInfo)', error.message);
                callback(500);
            }else{
                log.d('userDAO.js', 'update: function (userInfo)', result);
                callback(200);
            }
        });
    },
    updateAddress: function (addressid, callback) {
        pool.query(userSqlMap.updateAddress, addressid, function (error, result) {
            if (error) {
                log.w('userDAO.js', 'updateAddress: function (addressid)', error.message);
                callback(500);
            }else{
                log.d('userDAO.js', 'updateAddress: function (addressid)', result);
                callback(200);
            }
        });
    },
    get: function (openid, callback) {
        pool.query(userSqlMap.get, openid, function (error, result) {
            if (error) {
                log.w('userDAO.js', 'getUserInfo: function (openid)', error.message);
                callback({
                    error:500,
                    msg:error.message
                });
            }else{
                log.d('userDAO.js', 'getUserInfo: function (openid)', result);
                callback(result[0]);
            }
        });
    }
};