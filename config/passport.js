var passport = require( 'passport' ),
	LocalStrategy = require( 'passport-local' ).Strategy,
	GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy,
	mongoose = require( 'mongoose' ),
	config = require( '../config/config.js' ),
	User = mongoose.model( 'User' );

passport.use( new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function ( email, password, done ) {
		User.findOne( { email: email }, function ( err, user ) {
			if ( err ) {
				return done( err );
			}

			if ( !user ) {
				return done( null, false, { message: 'Incorrect email.' } );
			}

			if ( !user.validPassword( password ) ) {
				return done( null, false, { message: 'Incorrect password.' } );
			}

			return done( null, user );
		} );
	}
) );

passport.use( new GoogleStrategy( config.googleAuth,
	function ( accessToken, refreshToken, profile, done ) {
		// TODO: Why are we deferring this execution?
		process.nextTick( function () {
			// Find the user using the Google ID.
			User.findOne( { googleId: profile.id }, function ( err, user ) {
				if ( user ) {
					return done( err, user );
				} else {
					// Or create one.
					var newUser = new User();
					newUser.googleId = profile.id;
					newUser.name = profile.displayName;
					newUser.email = profile.emails[ 0 ].value;
					newUser.save( function p( err ) {
						return done( err, newUser );
					} );
				}
			} );
		} );
	}
) );

passport.serializeUser( function ( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function ( user, done ) {
	done( null, user );
} );
