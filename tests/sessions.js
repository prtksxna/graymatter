require( '../models/user' );

var superagent = require('superagent'),
	expect = require('expect.js'),
	mongoose = require( 'mongoose' ),
	User = mongoose.model('User'),
	config = require( '../config/config.js'),
	testUrl = config.dev.api + 'sessions/';

describe( 'Sessions API', function () {

	before( function ( done ) {
		mongoose.connect( config.dev.db, function ( error ) {
			if ( error ) {
				throw error;
			}

			console.log( '  > Creating test user - bob@example.com' );
			var user = new User();
			user.email = 'bob@example.com';
			user.setPassword( '12345678' );
			user.save( function ( err ) {
				if ( err ) {
					throw( err );
				}
				console.log( '  > Done!' );
				done();
			} );
		} );
	} );

	describe( 'Login Validations', function () {

		it( 'should not let a user login without email', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { password: 12345678 } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body.message ).to.be( 'Please fill out all fields' );
					done();
				} );
		} );

		it( 'should not let a user login without password', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body.message ).to.be( 'Please fill out all fields' );
					done();
				} );
		} );

		it( 'should not let a user login if it doesn\'t exist', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'notbob@example.com', password: 12345678 } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body.message ).to.be( 'No user with these details' );
					done();
				} );
		} );

		it( 'should not let the user login with an incorrect password', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: 123456789 } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body.message ).to.be( 'Incorrect password' );
					done();
				} );
		} );
	} );

	it( 'should let the user login' );/*, function ( done ) {
		superagent
			.post( testUrl + 'new' )
			.send( { email: 'bob@example.com', password: '12345678' } )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 200 );
				expect( res.body ).to.have.property( 'token' );
				done();
			} );
	} );*/

	after( function ( done ) {
		console.log( '  > Looking for test user - bob@example.com' );
		User.remove( { email: 'bob@example.com' }, function ( err, user ) {
			console.log( '  > Removed test user - bob@example.com' );
			mongoose.disconnect( function () {
				done();
			} );
		} );
	} );

} );
