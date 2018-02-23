 var mongoose = require('mongoose');
 var moment=require('moment')


//mongoose.connect('mongodb://127.0.0.1/nodelogin');
//var db = mongoose.connection;
var bcrypt=require('bcrypt');

// User Schema

let Schema=mongoose.Schema;
var UserSchema = Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String,bcrypt:true,required:true
	},
	email: {
		type: String,
		unique:true
	},
	name: {
		type: String
    },
    login:{
        type:Date
    },
    logout:{
        type:Date
	},
	userType:{
		type:String
	},
	cart:{
			item:{type:Schema.Types.ObjectId,ref:'Item'},
			quantity:{type:Number}
	}
	
});



var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
 
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};
module.exports.updateLogin=function(name,callback)
{
	User.findOneAndUpdate({
		"username" : name
	},{
		$set:{
			"login":moment()
		}
	},callback);

};
module.exports.updateLogout=function(name,callback)
{
	User.findOneAndUpdate({
		"username":name
	},{
		$set:{
			"logout":moment()
		}
	},callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
} 