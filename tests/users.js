require( '../models/user' );

var
	superagent = require( 'superagent' ),
	expect = require( 'expect.js' ),
	mongoose = require( 'mongoose' ),
	User = mongoose.model( 'User' ),
	config = require( '../config/config.js' ),
	testUrl = config.dev.api + 'users/';

describe( 'Users API', function () {

	before( function ( done ) {
		mongoose.connect( config.dev.db ).then( function () {
			console.log( '  > Looking for test user - bob@example.com' );
			User.remove( { email: 'bob@example.com' } ).then( function ( user ) {
				console.log( '  > Removed test user - bob@example.com' );
				done();
			} );
		} );
	} );

	describe( 'Registration', function () {

		it( 'should let a user register with email and password', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 201 );
					expect( res.body ).to.have.property( 'message' );
					done();
				} );
		} );
	} );

	describe( 'Registering validations', function () {

		it( 'should return an error (400/bad request) if there is no email', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body.message ).to.be( 'Please fill out all fields' );
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
					expect( res.body.message ).to.be( 'Please fill out all fields' );
					done();
				} );
		} );

		it( 'should not accept an invalid email address', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bobexample.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body ).to.have.property( 'errors' );
					expect( res.body.message ).to.be( 'User validation failed' );
					expect( res.body.errors.email.message ).to.be( 'Invalid email' );
					done();
				} );
		} );

		it( 'should not accept a password smaller than 8 characters', function ( done ) {
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: '123456' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body ).to.have.property( 'errors' );
					expect( res.body.message ).to.be( 'User validation failed' );
					expect( res.body.errors.password.message ).to.be( 'Password too short, must be 8 characters' );
					done();
				} );
		} );

		it( 'should check if the email id is unique', function ( done ) {
			// Retrying with the same email ID as used in the previous test set
			superagent
				.post( testUrl + 'new' )
				.send( { email: 'bob@example.com', password: '12345678' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be( 400 );
					expect( res.body ).to.have.property( 'message' );
					expect( res.body.message ).to.be( 'User validation failed' );
					expect( res.body.errors.email.message ).to.be( 'User with this email ID already exists' );
					done();
				} );
		} );

	} );

	describe( 'User profile actions', function () {
		var token;

		before( function ( done ) {
			// Login and get a token
			superagent
				.post( config.dev.api + 'sessions/new' )
				.send( { email: 'bob@example.com', password: '12345678' } )
				.end( function ( e, res ) {
					token = res.body.token;
					done();
				} );
		} );

		it( 'should be able to return a user profile', function ( done ) {
			superagent
				.get( testUrl )
				.set( 'Authorization', 'Bearer ' + token )
				.end( function ( e, res ) {
					expect( res.body ).to.have.property( 'email' );
					expect( res.body ).to.have.property( 'name' );
					done();
				} );
		} );

		it( 'should be able to update name in the user profile', function ( done ) {
			superagent
				.post( testUrl )
				.set( 'Authorization', 'Bearer ' + token )
				.send( { name: 'Bob' } )
				.end( function ( e, res ) {
					expect( res.status ).to.be.equal( 200 );
					expect( res.body ).to.have.property( 'name' );
					expect( res.body.name ).to.be.equal( 'Bob' );
					done();
				} );
		} );
	} );

	it( 'should allow me to log out of other computers and thus blacklist the token' );

	after( function ( done ) {
		console.log( '  > Looking for test user - bob@example.com' );
		User.remove( { email: 'bob@example.com' } ).then( function ( user ) {
			console.log( '  > Removed test user - bob@example.com' );
			mongoose.disconnect().then( done );
		} );
	} );
} );
