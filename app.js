var createError = require('http-errors');
var express = require('express');

var mongoose = require('mongoose');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promRouter = require('./routes/promotions');
var leadRouter = require('./routes/leaders');

var dishes = require('./models/dishes');
var promotions = require ('./models/promotions');
var leaders = require('./models/leaders');

const url='mongodb://localhost:27017/conFusion';

const connect= mongoose.connect(url);

connect.then((db)=>{
  console.log("Connected to the Database");
},(err)=>{
  console.log(err);
})

var app = express();

function auth(req,res,next){
  console.log(req.headers);
  var authHeader=req.headers.authorization;

  if(!authHeader){
    var err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate','Basic');
    err.status=401;
    next(err);
    return;
  }
  var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

  var user=auth[0];
  var pass=auth[1];
  if(user=="admin"&&pass=="password"){
    next();
  }else{
    var err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate','Basic');
    err.status=401;
    next(err);
    return;
  }
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/dishes',dishRouter);
app.use('/leaders',leadRouter);
app.use('/promotions',promRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

