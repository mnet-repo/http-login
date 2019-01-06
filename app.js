var express = require('express')
var app = express()
var userSchema = require('./user')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var crypto = require("crypto")

var url = "mongodb://127.0.0.1:27017/mongo"
var db = mongoose.connect(url)

db.connection.on("error", function (error) {
  console.log("数据库连接失败：" + error)
})

db.connection.on("open", function () {
  console.log("数据库连接成功")
})

app.use(express.static('work'))
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', function (req, res) {
  res.render('index', __dirname + "work/index.html")
})


/*插入数据库函数*/
function insert(name, psw, nick) {
  var user = new userSchema({
    username: name,
    userpsw: psw,
    nickname: nick,
    logindate: new Date()
  })
  user.save(function (err, res) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(res)
    }
  })
}

/*注册页面数据接收*/
app.post('/register', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*")
  var UserName = req.body.username
  var UserPsw = req.body.password
  var Nickname = req.body.nickname
  var md5 = crypto.createHash("md5")
  var newPas = md5.update(UserPsw).digest("hex")
  var updatestr = { username: UserName }
  if (UserName == '') {
    res.send({ status: 'error', message: false })
  }
  res.setHeader('Content-type', 'application/jsoncharset=utf-8')
  userSchema.find(updatestr, function (err, obj) {
    if (err) {
      console.log("Error:" + err)
    }
    else {
      if (obj.length == 0) {
        insert(UserName, newPas, Nickname)
        res.send({ status: 'success', message: true })
      } else if (obj.length != 0) {
        res.send({ status: 'error', message: false })
      } else {
        res.send({ status: 'error', message: false })
      }
    }
  })
})

/*登录处理*/
app.post('/login', function (req, res, next) {
  console.log("req.body" + req.body)
  var UserPsw = req.body.password;

  var md5 = crypto.createHash("md5");
  var newPas = md5.update(UserPsw).digest("hex");

  var updatestr = { username: UserName, userpsw: newPas };
  res.header("Access-Control-Allow-Origin", "*");

  userSchema.find(updatestr, function (err, obj) {
    if (err) {
      console.log("Error:" + err);
    }
    else {
      if (obj.length == 1) {
        console.log('登录成功');
        res.send({ status: 'success', message: true, data: obj })
      } else {
        console.log('请注册账号')
        res.send({ status: 'error', message: false })
      }
    }
  })
})

var server = app.listen(8080, function () {
  console.log('server connect')
})