// *Attached to `/users`*

var
	express = require('express'),
	router = express.Router(),
	mongoose = require( 'mongoose' ),
	passport = require( 'passport' ),
	User = mongoose.model( 'User' );

// ## New Sessions

// **POST: /sessions/new**
// ```
// {
//   email: 'bob@example.com',
//   password: '12345678'
// }
// ```
router.post( '/new', function ( req, res, next ) {
	// It will return a `400` if either of them is missing.
	if ( !req.body.email || !req.body.password ) {
		return res
			.status( 400 )
			.json( {
				message: 'Please fill out all fields'
			} );
	}

	// Find a user with that email
	User.findOne( { email: req.body.email }, function ( err, user ) {
		if ( err ) {
			next( err );
		}

		// It will return a `400` is there is no user with this email
		if ( user === null ) {
			return res
				.status( 400 )
				.json( {
					message: 'No user with these details'
				} );
		}

		return res
			.json( user );
	} );
} );

module.exports = router;
