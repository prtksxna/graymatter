// ## User schema

var
	UserSchema,
	config = require( '../config/config.js' ),
	mongoose = require( 'mongoose' ),
	crypto = require( 'crypto' ),
	jwt = require( 'jsonwebtoken' );

UserSchema = new mongoose.Schema( {
	email: {
		type: String,
		required: true,
		unique: true
	},
	name: String,
	hash: String,
	googleId: String,
	salt: String
} );

UserSchema.methods.setPassword = function ( password ) {
	this.salt = crypto.randomBytes( 16 ).toString( 'hex' );
	this.hash = crypto.pbkdf2Sync( password, this.salt, 1000, 64 ).toString( 'hex' );
};

UserSchema.methods.validPassword = function ( password ) {
	// Just to be safe, also the tests use 12345678 as password
	password = password.toString();

	var hash = crypto.pbkdf2Sync( password, this.salt, 1000, 64 ).toString( 'hex' );
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
	var
		today = new Date(),
		exp = new Date( today ),
		timeSalt = new Date().getTime();
	exp.setDate( today.getDate() + 60 );

	return jwt.sign( {
		_id: this._id,
		email: this.email,
		jit: this._id + timeSalt,
		exp: parseInt( exp.getTime() / 1000 )
	}, config.dev.secret );
};

UserSchema.path( 'email' ).validate( function ( email ) {
	// > TODO: Check this regular expression
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test( email );
}, 'Invalid email' );

// > TODO: Add a decorator to remove this user as admin and member from
// > old groups, and delete those groups that contain
// > only this user

mongoose.model( 'User', UserSchema );
