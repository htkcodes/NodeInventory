var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = Schema({
  item_name:String,
  item_price:Number,
  quantity_purchased:Number,
  order_date:Date,
  total:Number,
  ready:Boolean,
  user_name:String,
  user_id:{type:Schema.Types.ObjectId,ref:'User'},
  item_id:{type:Schema.Types.ObjectId,ref:'Item'}
  });



module.exports = mongoose.model('Orders', OrderSchema);