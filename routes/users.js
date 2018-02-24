var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var moment = require('moment');
var User = require('../models/users');
var item = require('../models/item');
var profit = require('../models/profit');
var async = require('async');
var moment = require('moment');


/* GET users listing. */
router.get('/', function (req, res, next) {

    res.redirect('/users/login');
});

router.get('/profit', function (req, res) {
    async.series({
        item_total: function (callback) {
            item.aggregate({
                $group: {
                    _id: null,
                    sum: {
                        $sum: "$total"
                    }
                }
            }, callback)
        },


    }, function (err, results) {

        profit.count(function (err, count) {

            var weekly = results.item_total[0].sum;
            var newProfit = new profit({
                week: moment().weeks(),
                date: moment().isoWeekday("Friday"),
                amount: 45000,
            });

            if (!err && count === 0) {

                newProfit.save(function (err) {
                    if (err) {
                        return (err)
                    }
                });

            } else if (!err && count !== 0) {

                newProfit.save(function (err) {
                    if (err) {
                        return next(err)
                    }

                    //Find Latest date then assigns id to dateid
                    var latest = profit.find({}).sort({
                        date: -1
                    }).limit(1).exec(function (err, foo) {
                        var dateid = foo[0]._id;

                        console.log(dateid + " lastest id");
                        //Finds previous document based on the id from dateid
                        profit.find({
                            _id: {
                                $lt: dateid
                            }
                        }).sort({
                            date: -1
                        }).limit(1).exec(function (err, prev) {
                            //Removes the document from the database if the week is the same

                            if (foo[0].week == prev[0].week) {
                                profit.remove({
                                    _id: foo[0]._id
                                }).exec(function (err) {
                                    if (err) {
                                        return err;
                                    }
                                });
                            } else {
                                return;
                            }

                        })

                    })
                });
            }

        })



        profit.find({}, 'week date amount').exec(function (err, foo) {
            if (err) {
                return next(err);
            }
            res.render('profit', {
                title: 'Profit Table',
                error: err,
                data: results,
                wklySales: foo
            })
        })

        ;

    });
});

router.get('/cleanup', function (req, res, next) {
    res.render('reset', {
        title: 'Cleanup'
    });
})

// Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
    //Sunday Login

    if (moment().weekday() == 0) {
        res.redirect('cleanup');
    } else {
        res.render('login', {
            title: 'Login'
        });
        req.flash('success_msg', 5)
    }

});

// Register User
router.post('/register', function (req, res) {

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isEmpty(obj) {

        if (obj == null) return true;

        if (obj.length > 0) return false;

        if (obj.length === 0) return true;

        if (typeof obj !== "object") return true;


        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;


    }

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var userType = req.body.userType;
    var secret = req.body.secret;
    var secretconfirm = "copperexplaintruck";

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    //  req.checkBody('userType', 'User Type is Required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('secret', 'The secret is incorrect').equals(secretconfirm);



    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        //Checks if the item thats being added doesn't exist in the database
        User.find({
            email: email
        }).limit(1).exec(function (err, email_exist) {
            if (err) {
                throw err;
            }

            if (isEmpty(email_exist) == false) {

                var user_exists = true;

                let errors = "Username Already Exists";

                res.render('register', {
                    user_exist: errors
                });
            } else {
                var newUser = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    userType: userType
                });

                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    console.log(user);
                });
                req.flash('success_msg', 'You are registered and can now login');
                res.redirect('/users/login');
            }

        })
    }
});

//Passport Strategy
passport.use(new LocalStrategy({
        usernameField: 'email',
    },
    function (email, password, done) {
        User.getUserByEmail(email, function (err, user) {
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
        app.set('name', req.body.email);
        User.updateLogin(app.get('name'), function (err, name) {});

        User.getUserByEmail(req.body.email, function (err, user) {
            if (err) throw err;
            if (!user) {
                console.log(user);
                return done(null, false, {
                    message: 'Unknown User'
                });
            } else if (user.userType === "admin") {
                console.log('admin')
                res.redirect('/inventory');
            } else {
                res.redirect(
                    'consumer'
                );
            }

        });
    });

router.get('/logout', function (req, res) {
    var name = app.get('name');
    console.log(name);
    req.logout();
    User.updateLogout(name, function (err, name) {
        console.log('log out logged');
    })
    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

router.get('/consumer', function (req, res, next) {
    item.find({}, 'name quantity price sold total')
        .exec(function (err, list_items) {
            if (err) {
                return next(err);
            }
            //Successful, so render

            res.render('consumer', {
                title: 'Products',
                item_list: list_items
            });
        });
})

router.get('/cart',function(req,res,next){
    User.findById({_id:req.user._id},'cart')
    .populate("cart.item")
    .exec(function(err,result){
       let cart_total=0;
      for(let i=0;i<result.cart.length;i++)
      {
          cart_total+=result.cart[i].item.price*result.cart[i].quantity;
      }
      console.log("CART TOTAL" + cart_total)
       if(err){throw err;}
       res.render('cart',{title:"My Cart",cart:result})
    })
})

router.post('/addtocart', function (req, res, next) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isEmpty(obj) {

        if (obj == null) return true;

        if (obj.length > 0) return false;

        if (obj.length === 0) return true;

        if (typeof obj !== "object") return true;


        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;

    }

    let _id = req.body._id;
    let quantity =req.body.quantity
    app.set('quantity',quantity);
    req.checkBody('_id', 'ID is Required').notEmpty();
    req.checkBody('quantity', 'Quantity Should not be empty').notEmpty();
    req.checkBody('quantity', 'Quantity Should be a Number').isNumeric();

    var errors = req.validationErrors();

    if (errors) {
        res.send(errors)
    } else {
        app.set('user_id', req.user._id);
        async.waterfall([
            function (callback) {
                item.findById(req.body._id, function addItemToCart(err, found_item) {
                    callback(err, found_item);
                })
            },
            function (found_item, callback) {
                User.findById(app.get('user_id'), function store(err, found_User) {
                    User.find({
                            _id: found_User._id
                        })
                        .exec(function (err, cart_exists) {
                            var cart = {
                                item: found_item._id,
                                quantity: quantity
                            }
                            if (err) {
                                throw err;
                            }
                            User.find({
                                "cart.item":cart.item
                            },function (err, count) {
                               
                                if(!isEmpty(count))
                                {
                                 
                                    User.findOneAndUpdate({
                                        "cart.item":cart.item
                                       /*  cart: {
                                            $elemMatch: {
                                                item: cart.item,
                                                quantity: {
                                                    $gte: 1
                                                }
                                            }
                                        } */
                                    }, {
                                        $inc: {
                                        "cart.$.quantity":app.get('quantity')
                                        }
                                    },function(err, results) {
                                        if (err) {
                                            throw err
                                        }
                                     
                                        res.send("This item was already in your cart" + `<br>` + "Quantity has been updated to:"+(results.cart[0].quantity+1)) 
                                    })

                                }
                                else{
                                   User.findOneAndUpdate({
                                       _id:req.user._id
                                   },{
                                       $push:{
                                           cart:cart
                                       }
                                   },function(err){
                                       if(err){throw err;}
                                       res.send(true);
                                   })
                                }
                              
                        
                            })

                        })

                })
            }
        ])
    }










})

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated());
        res.redirect('/inventory');
    }
    res.redirect('/users/login');
}

module.exports = router;