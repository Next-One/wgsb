let request = require('request');

let fs = require('fs'); // 载入fs模块


module.exports = {
  httpPost: function (url, data) {
    let writeStream = fs.createWriteStream('image.png');
    let readStream = request({
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: data
    });
    readStream.pipe(writeStream);
    readStream.on('end', function () {
      console.log('文件下载成功');
    });
    readStream.on('error', function () {
      console.log("错误信息:" + err)
    })
    writeStream.on("finish", function () {
      console.log("文件写入成功");
      writeStream.end();
    });
  },
  getOrderNum: function() {
    //订单号
    let orderNum = ""; 
    //6位随机数，用以加在时间戳后面。
    for (let i = 0; i < 3; i++) {
      orderNum += Math.floor(Math.random() * 10);
    }
    //时间戳，用来生成订单号。
    return new Date().getTime() + orderNum;
  }
}