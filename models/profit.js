var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const expenses=30000;

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

ProfitSchema
.virtual('gross_profit')
.get(function(){
 let gross=this.amount-expenses;
 return gross;
})

module.exports = mongoose.model('Profit', ProfitSchema);