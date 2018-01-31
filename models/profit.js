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
const hun=100;
  let profit=this.amount-expenses;
  let percentage=(profit/this.amount)*hun;
let gross={
  profit:profit,
  percentage:percentage.toFixed(0)
}
 return gross;
});



module.exports = mongoose.model('Profit', ProfitSchema);