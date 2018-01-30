var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProfitSchema = Schema({
   week: {type: Number, required: true, max: 100},
   date:{type:Date},
   amount:{type:Number}
  },{
    toObject:{
      virtuals:true
    },
    toJSON:{
      virtuals:true
    }
  });
//Export model
module.exports = mongoose.model('Profit', ProfitSchema);