// *Attached to `/users`*

var
	express = require( 'express' ),
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

// ## Third party authentication

// **GET: /sessions/google**

// This will redirect to the Google permission page and once accepted
// back to the the app.
router.get( '/google', passport.authenticate( 'google', {
	// > TODO: Revisit these scopes and see what is required
	scope: 'https://www.google.com/m8/feeds ' +
		'https://www.googleapis.com/auth/userinfo.email ' +
		'https://www.googleapis.com/auth/userinfo.profile'
} ) );

// This the callback called from Google. It returns the JWT of the user
// whether it was new or existing.
router.get( '/google/callback',
	passport.authenticate( 'google', {
		// > TODO: What should we do here?
		// > I am unsure of how this entire process will be
		// > consumed by the UI and will make changes here once
		// > we know more.
		failureRedirect: '/login'
	} ),
	function ( req, res ) {
		return res.json( {
			// Successful authentication, generate and return JWT.
			token: req.user.generateJWT()
		} );
	}
);

module.exports = router;
