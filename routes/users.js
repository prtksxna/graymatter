// *Attached to `/users`*

var
	express = require('express'),
	router = express.Router(),
	mongoose = require( 'mongoose' ),
	passport = require( 'passport' ),
	User = mongoose.model( 'User' );

// ## New User

// **POST: /users/new**
// ```
// {
//   email: 'bob@example.com',
//   password: '12345678'
// }
// ```
router.post( '/new', function ( req, res, next ) {
	// > TODO: Fix scattered validations

	// It will return a `400` if either of them is missing.
	if ( !req.body.email || !req.body.password ) {
		return res
			.status( 400 )
			.json( {
				message: 'Please fill out all fields'
			} );
	}

	// Validation for the password happens in the router as password isn't part
	// of the UserSchema.
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

	user.save( function p( err ) {
		if ( err ) {
			// Check if the error is a ValidationError and send it as is in case it is.
			if ( err.name === 'ValidationError' ) {
				return res
					.status( 400 )
					.json( err );
			}

			// `E11000`: Check if a user with that email already exists
			if ( err.message.indexOf( 'E11000' ) > -1 ) {
				return res
					.status( 400 )
					.json( {
						message: 'User validation failed',
						errors: {
							email: {
								message: 'User with this email ID already exists',
								value: req.body.email
							}
						}
					} );

			}
			return next( err );
		}

		// Return `201`: Resource created.
		return res
			.status( 201 )
			.json( {
				message: 'User created'
			} );
	} );
} );

module.exports = router;
