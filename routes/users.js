// *Attached to `/users`*

var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var passport = require( 'passport' );
var User = mongoose.model( 'User' );



// ## New User
// `POST` email and password in JSON to `/users/new`/ to create a new user.
// ```
// {
//   email: 'bob@example.com',
//   password: '123456'
// }
// ```
router.post( '/new', function( req, res, next ) {
	// It will return a `400` if either of them is missing.
	if( !req.body.email || !req.body.password ){
		return res
			.status( 400 )
			.json( {
				message: 'Please fill out all fields'
			} );
	}

	// Validation for the password happens in the router as password isn't part
	// of the UserSchema.
	// > TODO: Fix the fact the validations are scattered
	if ( req.body.password.length < 8 ) {
		return res
			.status( 400 )
			.json( {
				message: 'User validation failed',
				errors: {
					password: {
						message: 'Password too short, must be 8 characters',
						value: req.body.password.length
					}
				}
			} );
	}

	// Create a new user object.
	var user = new User();
	user.email = req.body.email;
	user.setPassword( req.body.password );

	user.save( function( err ) {
		if ( err ) {
			// Check if the error is a ValidationError and send it as is in case it is.
			if ( err.name === "ValidationError" ) {
				return res
					.status( 400 )
					.json( err );
			}
			return next( err );
		}

		// Generate and return a JWT.
		return res.json( {
			token: user.generateJWT()
		} );
	} );
} );

module.exports = router;
