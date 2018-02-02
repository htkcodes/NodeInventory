var item = require('../models/item');
var express = require('express');
var moment=require('moment');
var app=express();

// Display list of all items

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        item_total:function(callback){
            item.aggregate({
                $group:{
                    _id:null,
                    sum:{
                        $sum:"$total"
                    }
                }
                },callback)
        },
        item_count: function(callback) {
            item.count(callback);
        }
    }, function(err, results) {
       // console.log(results.item_total[0].sum)
        res.render('index', { title: 'OVERVIEW', error: err, data: results });
    });
};

exports.item_list = function(req, res, next) {
 
        if(moment().weekday()!=0)
        {
            item.find({}, 'name quantity price sold total')
            .exec(function (err, list_items) {
              if (err) { return next(err); }
              //Successful, so render
              console.log(list_items);
              res.render('item_list', { title: 'Products', item_list: list_items });
            });
        }
        else{
            item.findOneAndUpdate({total:{$gt:0}},
                {
                    $set:{total:0}
                },
                {
                    multi:true
                }
                )
                .exec(function(err,list_items){
                    if(err){
                        return next(err);
                    }
                    res.send('Done');
                })
        }
       
     
        
    };

// Display item create form on GET
exports.item_create_get = function(req, res) {
    res.render('item_form', { title: 'Item Add' });
};
// Handle item create on POST
exports.item_create_post = function(req, res,next) {
    req.checkBody('name', 'Item name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
   // req.checkBody('quantit', 'Quantity must not be empty').isEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();

    
    req.sanitize('name').escape();
    req.sanitize('quantity').escape();
    req.sanitize('price').escape();
    req.sanitize('name').trim();     
    req.sanitize('quantit').trim();
    req.sanitize('price').trim();


    var errors = req.validationErrors();
    
    var items = new item(
      { name: req.body.name, 
        quantity: req.body.quantit, 
        price: req.body.price,
        sold:0,
        total:0
       });
       
    if (errors) {
        res.render('item_form', { title: 'Item', item: items, errors: errors});
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
    req.checkBody('_id', 'Item id must exist').notEmpty(); 

    var errors = req.validationErrors();
    
    if (errors) {
        res.render('item_delete', { title: 'Delete Items', errors: errors});
    return;
    }
    else{
        item.findByIdAndRemove(req.body._id,function deleteItem(err){
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

    req.checkBody('quantity', 'Quantity must not be empty').notEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();


    if(req.body.quantity < 0 )
    {

    }
    req.sanitize('quantity').trim();
    req.sanitize('quantity').escape();
   
    req.sanitize('price').escape();    
  
    req.sanitize('price').trim();

    var items = new item(
        {  name: req.body.name, 
          quantity: req.body.quantity, 
          price: req.body.price,
          _id:req.body._id,
          sold:req.body.sold,
          total:req.body.total
         });
    
    var errors = req.validationErrors();
 
     
    if (errors) {
        res.render('item_update', { title: 'Update Items',item:items, errors: errors});
    return;
    }
    else{
        item.findByIdAndUpdate(req.body._id,items,function updateItem(err){
            if(err){return next(err);}
            res.redirect('/inventory/items');
        });

    }
};
