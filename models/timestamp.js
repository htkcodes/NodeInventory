var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeSchema = Schema({
   date: {type: Date},
    future: {type: Date}
  },{
    toObject:{
      virtuals:true
    },
    toJSON:{
      virtuals:true
    }
  });



//Export model
module.exports = mongoose.model('Time', TimeSchema);