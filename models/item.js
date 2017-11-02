var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = Schema(
  {
   name: {type: String, required: true, max: 100},
    quantity: {type: Number, required: true, max: 100},
   price:{type:Number}
  }
);

// Virtual for author's full name
ItemSchema
.virtual('item_name')
.get(function () {
  return this.name + ', ' + this.quantity + ',' + this.price;
});


//Export model
module.exports = mongoose.model('Item', ItemSchema);