module.exports = {
    add: 'insert into user set openid=?,nickName=? on duplicate key update nickName=?',
    get: 'select * from user where openid=?',
    update: 'update user set nickName=?,avatarUrl=?,province=?,gender=?,city=? where openid=?',
    updateAddress: 'update user set addressid=? where openid=?'
};