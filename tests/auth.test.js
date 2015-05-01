var superagent = require('superagent');
var expect = require('expect.js');

describe( 'Authentication API', function () {

	describe( 'Registering', function () {

		it ( 'should return an error if there is no email', function ( done ) {
			superagent
				.post( 'http://localhost:3000/register' )
				.send( { password: '123' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

	} );


	it( 'should let a user register with email and password' );
	it( 'should let a user register with Google' );
} );
