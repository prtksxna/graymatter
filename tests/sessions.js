require( '../models/user' );

var superagent = require('superagent'),
	expect = require('expect.js'),
	mongoose = require( 'mongoose' ),
	User = mongoose.model('User');

describe( 'Sessions API', function () {

	before( function ( done ) {
		mongoose.connect( 'mongodb://localhost/graymatter', function ( error ) {
			if ( error ) {
				throw error;
			}
			done();
		} );
	} );

	describe( 'Login Validations', function () {

		it( 'should not let a user login without email', function ( done ) {
			superagent
				.post( 'http://localhost:3000/sessions/new' )
				.send( { password: 12345678 } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it( 'should not let a user login without password', function ( done ) {
			superagent
				.post( 'http://localhost:3000/sessions/new' )
				.send( { email: 'bob@example.com' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it( 'should not let a user login if it doesn\'t exist' );

	} );

	it( 'should let the user login' );/*, function ( done ) {
		// TODO: Store the localhost URL part somewhere, DRY!
		superagent
			.post( 'http://localhost:3000/sessions/new' )
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
