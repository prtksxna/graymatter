var superagent = require('superagent');
var expect = require('expect.js');

describe( 'Users API', function () {

	describe( 'Registering validations', function () {

		it ( 'should return an error (400/bad request) if there is no email', function ( done ) {
			superagent
				.post( 'http://localhost:3000/users/new' )
				.send( { password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it ( 'should return an error (400/bad request) if there is no password', function ( done ) {
			superagent
				.post( 'http://localhost:3000/users/new' )
				.send( { email: 'bob@example.com' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it ( 'should not accept an invalid email address', function (done ) {
			superagent
				.post( 'http://localhost:3000/users/new' )
				.send( { email: 'bobexample.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body ).to.have.property( 'errors' );
					done();
				} );
		} );

		it ( 'should not accept a password smaller than 8 characters', function (done ) {
			superagent
				.post( 'http://localhost:3000/users/new' )
				.send( { email: 'bob@example.com', password: '123456' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body ).to.have.property( 'errors' );
					done();
				} );
		} );

	} );

	describe( 'Registration', function () {

		it( 'should let a user register with email and password' );
		it( 'should let a user register with Google' );

	} );
} );
