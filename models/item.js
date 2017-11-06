var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = Schema(
  {
   name: {type: String, required: true, max: 100},
    quantity: {type: Number, required: true, max: 100},
   price:{type:Number},
   sold:{type:Number},
   total:{
     type:Number
   }
  }
);

// Virtual for item's full name
ItemSchema
.virtual('item_name')
.get(function () {
  return this.name + ', ' + this.quantity + ',' + this.price;
});

ItemSchema
.virtual('quantityupdate')
.get(function(){
  return ((this.quantity-1));
})


//Export model
module.exports = mongoose.model('Item', ItemSchema);