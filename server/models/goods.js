var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var productSchma = new Schema({
  "productId": String,
  "productImage": String,
  "productName": String,
  "productUrl": String,
  "salePrice": Number
});
//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/stmall');
mongoose.connection.on('connected', function () {
  console.log("Mongoose connected success");
})
mongoose.connection.on('error', function () {
  console.log("Mongoose connected fail");
})
mongoose.connection.on('disconnected', function () {
  console.log("Mongoose connected disconnected");
})
module.exports = mongoose.model('Good', productSchma)