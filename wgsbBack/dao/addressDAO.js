let mysql = require('mysql');
let mysqlConf = require('../conf/mysqlConf');
let addressSqlMap = require('./addressSqlMap');
let pool = mysql.createPool(mysqlConf.mysql);
let log = require('../debugLog');

module.exports = {
    add: function (user_address_array,callback) {
        pool.query(addressSqlMap.add, user_address_array, function (error, result) {
            if (error) {
                log.w('addressDAO.js','add: function (user_address_array,callback)',error.message);
                callback(500);
            }else{
                log.d('addressDAO.js','add: function (user_address_array,callback)',result);
                callback(result.insertId+"");
            }
        });
    },
    update: function (user_address_array,callback) {
        pool.query(addressSqlMap.update,user_address_array, function (error, result) {
            if (error) {
                log.w('addressDAO.js','update: function (user_address_array,callback)',error.message);
                callback(500);
            }else{
                log.d('addressDAO.js','update: function (user_address_array,callback)',result);
                callback(200);
            }
        });
    },
    list: function (openid,callback) {
        pool.query(addressSqlMap.list,openid, function (error, result) {
            if (error) {
                log.w('addressDAO.js','list: function (openid,callback)',error.message);
                callback(error);
            }else{
                callback(result);
            }
        });
    },
    one: function (id,callback) {
        pool.query(addressSqlMap.one,id, function (error, result) {
            if (error) {
                log.w('addressDAO.js','list: function (id,callback)',error.message);
                callback(error);
            }else{
                if(result.length == 0){
                    callback("null");
                }else{
                    callback(result[0]);
                }
            }
        });
    },
    delete: function (id,callback) {
        pool.query(addressSqlMap.delete, id, function (error, result) {
            if (error) {
                log.w('addressDAO.js','delete: function (id,callback)',error.message);
                callback(500);
            }else{
                log.d('addressDAO.js','delete: function (id,callback)',result);
                callback(200);
            }
        });
    }
};
