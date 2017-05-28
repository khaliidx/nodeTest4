// for crypting the passwords
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

//user model
var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	displayName: String,
	bio: String,
	isAdmin: { type: Boolean, default: false }
});














userSchema.methods.name = function() {
	return this.displayName || this.username;
};



//magic (crypto)
var noop = function() {};

userSchema.pre("save", function(done) {
	
	var user = this;

	if (!user.isModified("password")) {
		return done();
	}

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) { return done(err); }
		bcrypt.hash(user.password, salt, noop,	
			function(err,hashedPassword){
				if (err) { return done(err); }
				user.password = hashedPassword;
				done();
			});
	});
});


//method to check passwords used in the setuppassport.js file
userSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(err, isMatch) {
		done(err, isMatch);
	});
};


//exporting model
module.exports = mongoose.model("User", userSchema);