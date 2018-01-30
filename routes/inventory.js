var express = require('express');
var router = express.Router();
var moment=require('moment');
var item_controller = require('../controllers/itemController');


router.get('/',ensureAuth, item_controller.index);

/* GET request for creating item. NOTE This must come before route for id (i.e. display item) */
router.get('/item/create',ensureAuth, item_controller.item_create_get);

/* POST request for creating item. */
router.post('/item/create',ensureAuth, item_controller.item_create_post);

router.get('/item/delete',ensureAuth,item_controller.item_delete_get);


// POST request to delete item
router.post('/item/delete', ensureAuth,item_controller.item_delete_post);

/* GET request to update item. */
router.get('/item/update',ensureAuth, item_controller.item_update_get);

// POST request to update item
router.post('/item/update',ensureAuth, item_controller.item_update_post);

/* GET request for list of all items. */
router.get('/items',ensureAuth, item_controller.item_list);

/*GET request for profit/expenses */




function ensureAuth(req,res,next){
    if(req.isAuthenticated()){
      console.log(req.isAuthenticated());
      return next();
    }
    res.redirect('/users/login');
}

module.exports = router;