var express = require('express');
var router = express.Router();


var item_controller = require('../controllers/itemController');




router.get('/', item_controller.index);

/* GET request for creating item. NOTE This must come before route for id (i.e. display item) */
router.get('/item/create', item_controller.item_create_get);

/* POST request for creating item. */
router.post('/item/create', item_controller.item_create_post);

router.get('/item/delete',item_controller.item_delete_get);
// POST request to delete item
router.post('/item/delete', item_controller.item_delete_post);

/* GET request to update item. */
router.get('/item/update', item_controller.item_update_get);

// POST request to update item
router.post('/item/update', item_controller.item_update_post);

/* GET request for list of all items. */
router.get('/items', item_controller.item_list);



module.exports = router;