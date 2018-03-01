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
 
            item.find({}, 'name quantity price sold total')
            .exec(function (err, list_items) {
              if (err) { return next(err); }
              //Successful, so render

              res.render('item_list', { title: 'Products', item_list: list_items });
            });
  
    };

// Display item create form on GET
exports.item_create_get = function(req, res) {
    res.render('item_form', { title: 'Item Add' });
};
// Handle item create on POST
exports.item_create_post = function(req, res,next) {

    var hasOwnProperty=Object.prototype.hasOwnProperty;

    function isEmpty(obj) {
        
        if(obj==null) return true;

        if(obj.length > 0) return false;

        if(obj.length ===0 ) return true;

        if(typeof obj !== "object") return true;


        for(var key in obj){
            if(hasOwnProperty.call(obj,key)) return false;
        }

        return true;


    }

    req.checkBody('name', 'Item name must be specified.').notEmpty();
    req.checkBody('name','Item name is too long').isLength({max:30}); 
    req.checkBody('name','Item name is short long').isLength({min:3}); 
    //req.checkBody('name','Blacklisted word detected').matches()
    
    //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('quantity', 'Quantity must not be empty').notEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();

    
    req.sanitize('name').escape();
    req.sanitize('quantity').escape();
    req.sanitize('price').escape();
    req.sanitize('name').trim(); 
    req.sanitize('quantity').trim();
    req.sanitize('price').trim();

var current_item=req.body.name;
    var errors = req.validationErrors();
    const zero=0;
    
    var items = new item(
      { name: req.body.name, 
        quantity: req.body.quantity, 
        price: req.body.price,
        sold:zero,
        total:zero
       });
       
    if (errors) {
        res.send(errors);
    return;
    } 
    else {
            //Checks if the item thats being added doesn't exist in the database
            item.find({name:current_item}).limit(1).exec(function(err,name_exists){
                if(err){
                    throw err;
                }
            
               if(isEmpty(name_exists) == false)
               {
                var item_exists=true;

                res.send(item_exists);
               }
               else 
               {
                  
                    //Saves if it doesnt exists
                items.save(function (err) {
                    if (err) { return next(err); }
                    res.send(false);
                    }); 
                    
                   
               }
                
            })
        }

   /*  // Data from form is valid
        items.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new iem record.
               res.redirect('/inventory/items');
            }); */ 

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
exports.item_update_get = function(req, res,next) {
    console.log('ok ke3l');
    item.findById(req.params.id,function updateItem(err,found_item){
        if(err){return next(err);}
        else{
            res.render('item_update', { title: 'Update Items',item:found_item});
        }
    })
};

// Handle item update on POST
exports.item_update_post = function(req, res,next) {
   
    
    req.checkBody('name', 'Item name must be specified.').notEmpty();
    req.checkBody('name','Item name is too long').isLength({max:30}); 
    req.checkBody('name','Item name is short long').isLength({min:3}); 
    //req.checkBody('name','Blacklisted word detected').matches()
    
    //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('quantity', 'Quantity must not be empty').notEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();

    
    req.sanitize('name').escape();
    req.sanitize('quantity').escape();
    req.sanitize('price').escape();
    req.sanitize('name').trim(); 
    req.sanitize('quantity').trim();
    req.sanitize('price').trim();
    
   
    
    var errors = req.validationErrors();

    if (errors) {
       res.send(errors);
    }
    else{
        item.findById(req.body._id,function(err,product){
            try{
                var updatedProduct = new item(
                    { name: req.body.name, 
                      quantity: req.body.quantity, 
                      price: req.body.price,
                      _id:product._id,
                      sold:product.sold,
                      total:product.total
                     }); 
    
                     item.findByIdAndUpdate(product._id,updatedProduct,function updateItem(err){
                        if(err){return next(err);}
                        res.send(true);
                    });
            }
            catch(err){
res.send(err);
            }
                
        });

    }
};

// Handle item sell on POST
exports.item_sell_post = function(req, res,next) {

    req.checkBody('_id', 'id not found').notEmpty();
   
    
    var errors = req.validationErrors();

    if (errors) {
       res.send(errors);
    }
    else{
        item.findById(req.body._id,function(err,product){
            try{
                if(product.currentqty < 1)
                {
                    res.send("Removed the disabbled attribute? Well that didn't do anything to the database :p")
                }
                else{
                    var updatedProduct = new item(
                        { name: product.name, 
                          quantity: product.quantityupdate, 
                          price: product.price,
                          _id:product._id,
                          sold:product.soldupdate,
                          total:product.totalupdate
                         }); 
        
                         item.findByIdAndUpdate(product._id,updatedProduct,function updateItem(err){
                            if(err){return next(err);}
                            res.send(true);
                        });
                } 
               
            }
            catch(err){
res.send("the ID was tampered with");
            }
                
        });

    }
};

