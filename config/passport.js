var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

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

passport.use( new GoogleStrategy(
	// TODO: Move this to config
	{
		clientID: '954841278741-tapbjff3qm8c67ubfhei1oal9jvsk0p8.apps.googleusercontent.com',
		clientSecret: 'bD0kKRspQYs9vwdP7tKBnV98',
		callbackURL: 'http://localhost:3000/sessions/google/callback'
	},
	function ( accessToken, refreshToken, profile, done ) {
		// TODO: Why are we doing this?
		process.nextTick( function () {
			User.findOne( { googleId: profile.id }, function ( err, user ) {
				if ( user ) {
					return done( err, user );
				} else {
					var newUser = new User();
					newUser.googleId = profile.id;
					newUser.email = profile.emails[ 0 ].value;
					newUser.save( function p( err ) {
						return done( err, newUser );
					} );
				}
			} );
		} );
	}
) );

// TODO: What is this?
passport.serializeUser( function ( user, done ) {
	done( null, user );
} );

// TODO: What is this?
passport.deserializeUser( function ( user, done ) {
	done( null, user );
} );
