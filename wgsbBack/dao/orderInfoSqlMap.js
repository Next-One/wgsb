module.exports = {
    add: 'insert into orderInfo(orderid,openid,userName,phoneNum,region,detail,allMinus,allPrice,fullMinus,packageFee,sendFee,minusSendFee,redPackage,bestTime,comment,orderStatus,payStatus,payType,sendType,tableware,bonusMoney,orderItem) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    update: 'update orderInfo set used=0 where orderid=?',
    list: 'select id,orderid,allPrice,orderItem,orderStatus from orderInfo where openid=?',
    used: 'select * from orderInfo where orderid=?',
    delete: 'delete from orderInfo where orderid=?'
}

