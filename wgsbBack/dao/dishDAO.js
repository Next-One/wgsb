const mysql = require('mysql'),
    mysqlConf = require('../conf/mysqlConf'),
    dishSqlMap = require('./dishSqlMap'),
    pool = mysql.createPool(mysqlConf.mysql),
    log = require('../debugLog');

module.exports = {
    list: function (callback) {
        pool.query(dishSqlMap.list, function (error, result) {
            if (error) {
                log.w('dishDAO.js', 'list: function (callback)', error.message);
            }
            log.d('dishDAO.js', 'list: function (callback)', result);
            callback(result);
        });
    },
    getType: function (type, callback) {
        pool.query(dishSqlMap.getType, type, function (error, result) {
            if (error) {
                log.w('dishDAO.js', 'getType: function (type,callback)', error.message);
            }
            log.d('dishDAO.js', 'getType: function (type,callback)', result);
            callback(result);
        });
    }
};