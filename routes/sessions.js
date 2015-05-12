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

	// Use Passport to authenticate
	passport.authenticate( 'local', function ( err, user, info ) {
		if ( err ) {
			next( err );
		}

		if ( user ) {
			return res.json( {
				token: user.generateJWT()
			} );
		} else {
			return res
				.status( 401 )
				.json( info );
		}
	} )( req, res, next );
} );

module.exports = router;
