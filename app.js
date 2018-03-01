var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ExpressValidator=require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var MongoStore=require('connect-mongo')(session)

var flash=require('connect-flash');
var mongo=require('mongodb');
var mongoose=require('mongoose');
var secret=require('./config/secret');
var Onesignal=require('./config/onesignal')


/* var message = { 
  app_id: "5678a7af-2cd3-4158-9953-360547c5d811",
  contents: {"en": "English Message"},
  included_segments: ["All"]
};


Onesignal.sendNotification(message); */
//mongodb://127.0.0.1/chipsinv -localhost db
//mongodb://root:bn33bn33@ds225028.mlab.com:25028/chipsinventory
mongoose.connect(secret.database,{
  useMongoClient:true
});
var db=mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));


var index = require('./routes/index');
var users = require('./routes/users');
var inventory=require('./routes/inventory');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(session({
  secret:secret.secretKey,
  saveUninitialized:true,
  resave:true,
  store:new MongoStore({url:secret.database,autoReconnect:true})
}));

app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(ExpressValidator({
  errorFormatter:function(param,msg,value){
    var namespace=param.split('.'),root = namespace.shift(),formParam=root;
    while(namespace.length){
      formParam+='['+namespace.shift()+ ']';
    }
    return{
      param:formParam,
      msg:msg,
      value:value
    };
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function(req,res,next){
res.locals.user=req.user || null;
next();
})



app.use('/', index);
app.use('/users', users);
app.use('/inventory',inventory);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.set('env','production');
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
