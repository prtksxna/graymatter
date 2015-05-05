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
			// TODO: Setup the right accounts for testing
			done();
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
		mongoose.disconnect();
		done();
	} );

} );
