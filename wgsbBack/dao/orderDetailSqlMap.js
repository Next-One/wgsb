module.exports = {
    add: 'insert into orderDetail(orderid,openid,dishid,quantity,price,discount,name,imgUrl) values(?,?,?,?,?,?,?,?)',
    update: 'update orderDetail set used=0 where id=?',
    list: 'select * from orderDetail where openid=?',
    used: 'select * from orderDetail where openid=? and used=1 and useTime>sysdate()',
    delete: 'delete from orderDetail where id=?'
}

