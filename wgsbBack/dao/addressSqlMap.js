module.exports = {
    add: 'insert into address(openid,userName,phoneNum,region,detail) values(?,?,?,?,?)',
    update: 'update address set userName=?,phoneNum=?,region=?,detail=? where id=?',
    list: 'select * from address where openid=?',
    one: 'select * from address where id=?',
    delete: 'delete from address where id=?'
}
