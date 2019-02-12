module.exports = {
    add: 'insert into bonus(openid,useTime,lowest,money,type) values(?,DATE_ADD(SYSDATE(),INTERVAL ? day),?,?,?)',
    update: 'update bonus set used=0 where id=?',
    list: 'select * from bonus where openid=?',
    used: 'select * from bonus where openid=? and used=1 and useTime>sysdate()',
    delete: 'delete from bonus where id=?'
}