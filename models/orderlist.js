var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderListSchema = Schema({
   name: {type: String, required: true, max: 100},
    quantity: {type: Number, required: true, max: 1000},
   totaldue:{
     type:Number
   },
   username:{
       type:String
   }
  },{
    toObject:{
      virtuals:true
    },
    toJSON:{
      virtuals:true
    }
  });

//Export model
module.exports = mongoose.model('OrderList', OrderListSchema);