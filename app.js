var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var login = require('./routes/user');
var index = require('./routes/index');
var upload = require('./routes/upload');
var chat = require('./routes/chat');

var app = express();

// swagger api
var swaggerInstall = require('./util/swagger')
const { error } = require("swagger-node-express");
swaggerInstall(app)

// const multer = require('multer');
// app.use(multer().any());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/login', login);
app.use('/record', index);
app.use('/record/upload', upload);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404)
    res.render('error', { status: err.status, message: 'Page Not Found' });
  else
    res.render('error', { status: err.status, message: err.message });
});




module.exports = app;
