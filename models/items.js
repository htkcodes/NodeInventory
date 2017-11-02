var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemsSchema = Schema(
  {
    name: {type: String, required: true, max: 100},
    quantity: {type: String, required: true, max: 100},
   price: {type: Number}
  }
);

// Virtual for Item Price and Quantity
ItemsSchema
.virtual('name')
.get(function () {
  return this.name + ', ' + this.quantity + ',' +this.price;
});


//Export model
module.exports = mongoose.model('Items', ItemsSchema);