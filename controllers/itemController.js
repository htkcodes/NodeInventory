var item = require('../models/item');

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
// Display detail page for a specific item
exports.item_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: item detail: ' + req.params.id);
};

// Display item create form on GET
exports.item_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item create GET');
};

// Handle item create on POST
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item create POST');
};

// Display item delete form on GET
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};