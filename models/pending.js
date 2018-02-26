var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pendingSchema = Schema({
pending:[{
    item:{type:Schema.Types.ObjectId,ref:'Item'},
    quantity:{type:Number},
    name:String,
    date:Date
}]
  });



module.exports = mongoose.model('Pending', pendingSchema);