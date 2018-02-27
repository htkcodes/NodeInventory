var express = require('express');
var router = express.Router();
var moment=require('moment');
var item_controller = require('../controllers/itemController');
var User=require('../models/users')

router.get('/',ensureAuthAdmin, item_controller.index);

/* GET request for creating item. NOTE This must come before route for id (i.e. display item) */
router.get('/item/create', ensureAuthAdmin,item_controller.item_create_get);

/* POST request for creating item. */
router.post('/item/create',ensureAuthAdmin, item_controller.item_create_post);

router.get('/item/delete',ensureAuthAdmin,item_controller.item_delete_get);

// POST request to delete item
router.post('/item/delete',ensureAuthAdmin, item_controller.item_delete_post);

/* GET request to update item. */
router.get('/item/update/:id',ensureAuthAdmin, item_controller.item_update_get);

// POST request to update item
router.post('/item/update',ensureAuthAdmin, item_controller.item_update_post);
//Post Request to sell item
router.post('/item/sell',ensureAuthAdmin,item_controller.item_sell_post);

/* GET request for list of all items. */
router.get('/items',ensureAuthAdmin, item_controller.item_list);




function ensureAuthAdmin(req,res,next){
    if(req.isAuthenticated()){
      User.findById({
        _id:req.user._id
    },'admin',function(err,found_user){
        if(found_user.admin === false)
        {
           res.redirect('/users/consumer')
        }
        else{
          return next()
        }
    });
    }
}

function ensureAuthUser(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;