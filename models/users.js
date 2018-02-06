 var mongoose = require('mongoose');
 var moment=require('moment')


//mongoose.connect('mongodb://127.0.0.1/nodelogin');
//var db = mongoose.connection;
var bcrypt=require('bcrypt');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String,bcrypt:true,required:true
	},
	email: {
		type: String
	},
	name: {
		type: String
    },
    login:{
        type:Date
    },
    logout:{
        type:Date
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

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
 
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