//TODO:add admin view to confirm pending orders
/* jshint node: true */
var express = require('express');
var app=express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var moment=require('moment');
var User = require('../models/users');
var Order=require('../models/orderlist');
var item=require('../models/item');
var async=require('async');


function ensureAuth(req,res,next){
    if(req.isAuthenticated()){
      console.log(req.isAuthenticated());
      return next();
    }
    res.redirect('/users/login');
  }
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

 // Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
  res.render('login', { title: 'Login'});
  //req.flash('success_msg',5)
});
//Gets pending orders and item list
router.get('/consumer',ensureAuth,function(req,res){
  
  async.series({
    itemlist:function(callback){
        item.find({}, 'name quantity price',callback);
    },
    pending:function(callback){
        Order.find({username:req.user.name},'_id name quantity totaldue username',callback);
    }
}, function(err, results) {
    console.log(results.pending)
   res.render('consumer',{title:'Orders',error:err,data:results})
});
});
router.get('/pending_delete',function(req,res){
    res.sendStatus(403);
});
router.get('/pending_confirm',function(req,res){
    Order.find({}, '_id name quantity totaldue username')
    .exec(function (err, pending_list) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(pending_list);
      res.render('pending_orders', { title: 'Pending List', pending_list: pending_list });
    });
})

router.post('/pending_*',function(req,res){
    req.checkBody('_id', 'Item id must exist').notEmpty(); 
    
        var errors = req.validationErrors();
        
        if (errors) {
            res.render('consumer', { title: 'Pending stuff', errors: errors});
        return;
        }
        else{
            Order.findByIdAndRemove(req.body._id,function deletePending(err){
                if(err){return next(err);}
                res.redirect('/users/consumer');
            });
    
        }
        
              
       
})
router.post('/consumer',function(req,res){
    var name=req.body.itemname;
    var quantity=req.body.quantity;
    var totaldue=req.body.totaldue;
    var username=req.body.username;

      // Validation
      req.checkBody('itemname', 'Name is required').notEmpty();
      req.checkBody('quantity', 'Quantity is required').notEmpty();
      req.checkBody('totaldue','total due').notEmpty();
      //req.checkBody('secret','The secret is incorrect').equals(secretconfirm);
  
          var errors = req.validationErrors();
          
          var newOrder = new Order({
            name: name,
            quantity: quantity,
            totaldue:totaldue,
            username:username
        });
  
      if (errors) {
          res.send('error',{
              errors:errors
          });
      } else {
        newOrder.save(function(err){
            if(err){return next(err);}
            res.redirect('/users/consumer')
        });
        }
      
      //  res.redirect('/users/consumer');
});

// Register User
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var secret =req.body.secret;
    var secretconfirm="chipsexec";
    var usertype=req.body.usertype;
    console.log(usertype);

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    //req.checkBody('usertype','Type is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    //req.checkBody('secret','The secret is incorrect').equals(secretconfirm);

		var errors = req.validationErrors();
		
	

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            userType:usertype,
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
              console.log(user);
                return done(null, false, {
                    message: 'Unknown User'
                });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
           
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    
    passport.authenticate('local', {
        //successRedirect: '/inventory',
       failureRedirect: '/users/login',
      failureFlash: 'Invalid username or password'
    }),
    function (req, res) {
        name=req.body.username;
app.set('name',req.body.username);
User.updateLogin(name,function(err,name){
    console.log('login logged');
});
let id=req.body.username;
let stype;
User.getUserType(id,function(err,name){
  app.set('sType',name.userType);
  stype=app.get('sType');
  console.log(stype+ ' USER TYPE CONSOLE' + stype);
  if(stype==='user')
  {
      res.redirect('/users/consumer');
  }
  else if(stype==='admin'){
      res.send('admin');
  }
  });

//TODO:ADD SHOW SECRET KEY UPON ADMIN SELECTION
  //var sType=app.get('sType');
   
    });

router.get('/logout', function (req, res) {
   var name= app.get('name');
   console.log(name);
    req.logout();
    User.updateLogout(name,function(err,name){
        console.log('log out logged');
    })
    req.flash('success_msg', 'You are logged out');
   
    res.redirect('/users/login');
}); 
module.exports = router;
