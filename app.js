var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('cert/visionhack.key', 'utf8');
var certificate = fs.readFileSync('cert/ssl.crt', 'utf8');
var validCiphers = 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:HIGH:!MD5:!RC4:!aNULL:!EDH:!AESGCM'
var sslOptions = {key: privateKey, cert: certificate, ciphers: validCiphers, honorCipherOrder: true};

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login')


var app = express();
var server = https.createServer(sslOptions, app);
var io = require('socket.io').listen(server, {
    "log level" : 3,
    "match origin protocol" : true,
    "transports" : ['polling', 'websocket']
});
server.listen(443);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('setNickname', function(data){
    socket.set(nickName, data);
    console.log(data);
  });
  socket.on('message', function(message){
      var data = { 'message': message };
      socket.broadcast.emit('message', data);
      console.log("user send this :" + message);
    });
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;