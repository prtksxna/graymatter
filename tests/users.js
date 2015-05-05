require( '../models/user' );

var
	superagent = require('superagent'),
	expect = require('expect.js'),
	mongoose = require( 'mongoose' ),
	User = mongoose.model('User'),
	config = require( '../config/config.js'),
	testUrl = config.dev.api + 'users/';

describe( 'Users API', function () {

	before( function ( done ) {
		mongoose.connect( config.dev.db, function ( error ) {
			if ( error ) {
				throw error;
			}
		} );
		console.log( '  > Looking for test user - bob@example.com' );
		User.remove( { email: 'bob@example.com' }, function ( err, user ) {
			console.log( '  > Removed test user - bob@example.com' );
			done();
		} );
	} );

	describe( 'Registration', function () {

		it( 'should let a user register with email and password', function (done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 201 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it( 'should let a user register with Google' );

	} );

	describe( 'Registering validations', function () {

		it( 'should return an error (400/bad request) if there is no email', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it( 'should return an error (400/bad request) if there is no password', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

		it( 'should not accept an invalid email address', function (done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bobexample.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body ).to.have.property( 'errors' );
					done();
				} );
		} );

		it( 'should not accept a password smaller than 8 characters', function (done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: '123456' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body ).to.have.property( 'errors' );
					done();
				} );
		} );

		it( 'should check if the email id is unique', function (done ) {
			// Retrying with the same email ID as used in the previous test set
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );

	} );

	after( function ( done ) {
		mongoose.disconnect();
		done();
	} );
} );
