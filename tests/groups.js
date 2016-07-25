require( '../models/group' );
require( '../models/user' );

var
	superagent = require( 'superagent' ),
	expect = require( 'expect.js' ),
	mongoose = require( 'mongoose' ),
	Group = mongoose.model( 'Group' ),
	User = mongoose.model( 'User' ),
	config = require( '../config/config.js' ),
	testUrl = config.dev.api + 'groups/';

describe( 'Group API', function () {

	before( function ( done ) {
		mongoose.connect( config.dev.db, function ( error ) {
			if ( error ) {
				throw error;
			}

			console.log( '  > Creating first test user - bob@example.com' );
			var user = new User();
			user.email = 'bob@example.com';
			user.setPassword( '12345678' );
			user.save( function ( err ) {
				if ( err ) {
					throw( err );
				}
				console.log( '  > Done!' );

				console.log( '  > Creating second test user - alice@example.com' );
				var user = new User();
				user.email = 'alice@example.com';
				user.setPassword( '12345678' );
				user.save( function ( err ) {
					if ( err ) {
						throw( err );
					}
					console.log( '  > Done!' );

					console.log( '  > Logging in bob@example.com' );
					superagent
						.post( config.dev.api + 'sessions/new' )
						.send( { email: 'bob@example.com', password: '12345678' } )
						.end( function ( e, res ) {
							token = res.body.token;
							done();
						} );
				} );
			} );
		} );
	} );

	it( 'should not return a list if user is not authenticated', function ( done ) {
		superagent
			.get( testUrl )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 401 );
				done();
			} );
	} );

	it( 'should not let you add an group if user is not authenticated', function ( done ) {
		superagent
			.post( testUrl )
			.send( { name: 'Test Group' } )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 401 );
				done();
			} );
	} );

	it( 'should not let you add a new group without a name', function ( done ) {
		superagent
			.post( testUrl )
			.set( 'Authorization', 'Bearer ' + token )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 400 );
				expect( res.body ).to.have.property( 'message' );
				expect( res.body ).to.have.property( 'errors' );
				done();
			} );
	} );

	it( 'should let you add a new group', function ( done ) {
		superagent
			.post( testUrl )
			.set( 'Authorization', 'Bearer ' + token )
			.send( { name: 'Test Group' } )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 201 );
				expect( res.body.name ).to.be.equal( 'Test Group' );
				expect( res.body.admins ).to.have.length( 1 );
				expect( res.body.members ).to.have.length( 0 );
				done();
			} );
	} );

	it( 'should return a list of groups the user is in', function ( done ) {
		superagent
			.get( testUrl )
			.set( 'Authorization', 'Bearer ' + token )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 200 );
				expect( res.body ).to.have.property( 'groups' );
				expect( res.body.groups ).to.be.an( 'array' );
				expect( res.body.groups ).to.have.length( 1 );
				done();
			} );
	} );

	it( 'should let user add members' );
	it( 'should check if the returned list has groups both member and admin of' );
	it( 'should let members remove themselves from a group' );
	it( 'should let admins make members admin' );
	it( 'should let admins remove members as admin' );
	it( 'should let admins remove admins as admin' );
	it( 'should let admins make themselves members' );
	it( 'should make sure an group is not admin-less' );
	it( 'should not let admin remove themselves (they need to un-admin first)' );

	after( function ( done ) {
		console.log( '  > Looking for test user - bob@example.com' );
		User.remove( { email: 'bob@example.com' }, function ( err, user ) {
			console.log( '  > Removed test user - bob@example.com' );

			console.log( '  > Looking for test user - alice@example.com' );
			User.remove( { email: 'alice@example.com' }, function ( err, user ) {
				console.log( '  > Removed test user - alice@example.com' );

				mongoose.disconnect( function () {
					done();
				} );
			} );
		} );
	} );

} );
