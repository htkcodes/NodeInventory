var item = require('../models/item');
var moment=require('moment');

// Display list of all items

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        item_count: function(callback) {
            item.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

exports.item_list = function(req, res, next) {
    
      item.find({}, 'name quantity price')
        .exec(function (err, list_items) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('item_list', { title: 'Item List', item_list: list_items });
        });
        
    };

// Display item create form on GET
exports.item_create_get = function(req, res) {
    res.render('item_form', { title: 'item Genre' });
};
// Handle item create on POST
exports.item_create_post = function(req, res,next) {
    req.checkBody('name', 'Item name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('quantit', 'Quantity must not be empty').isEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();

    
    req.sanitize('name').escape();
    req.sanitize('quantity').escape();
    req.sanitize('price').escape();
    req.sanitize('name').trim();     
    req.sanitize('quantity').trim();
    req.sanitize('price').trim();


    var errors = req.validationErrors();
    
    var items = new item(
      { name: req.body.name, 
        quantity: req.body.quantity, 
        price: req.body.price,
       });
       
    if (errors) {
        res.render('item_form', { title: 'Item Author', item: items, errors: errors});
    return;
    } 
    else {
    // Data from form is valid
    
        items.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new iem record.
               res.redirect('/inventory/items');
            });
    }

};
exports.item_delete_get=function(req,res,next){
    res.render('item_delete',{title:'Delete Item'});
};
// Handle item delete on POST
exports.item_delete_post = function(req, res) {
    req.checkBody('itemname', 'Item name must exist').notEmpty(); 

    var errors = req.validationErrors();
    
    if (errors) {
        res.render('item_delete', { title: 'Delete Items', errors: errors});
    return;
    }
    else{
        item.findOneAndRemove(req.body.itemname,function deleteItem(err){
            if(err){return next(err);}
            res.redirect('/inventory/items');
        });

    }
    
          
   
};
// Display item update form on GET
exports.item_update_get = function(req, res) {
    res.render('item_update',{title:'Update Item'});
};

// Handle item update on POST
exports.item_update_post = function(req, res,next) {
    req.checkBody('quantit', 'Quantity must not be empty').isEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();

    
    req.sanitize('quantity').trim();
    req.sanitize('quantity').escape();
   
    req.sanitize('price').escape();    
  
    req.sanitize('price').trim();

    var items = new item(
        {  name: req.body.name, 
          quantity: req.body.quantity, 
          price: req.body.price,
          _id:req.body._id
         });
    
    var errors = req.validationErrors();
 
     
    if (errors) {
        res.render('item_update', { title: 'Update Items',item:items, errors: errors});
    return;
    }
    else{
        item.findOneAndUpdate(req.body.itemname,items,function updateItem(err){
            if(err){return next(err);}
            res.redirect('/inventory/items');
        });

    }
};