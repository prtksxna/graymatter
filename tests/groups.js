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
	var bobsToken, alicesToken;

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
							bobsToken = res.body.token;

							console.log( '  > Logging in alice@example.com' );
							superagent
								.post( config.dev.api + 'sessions/new' )
								.send( { email: 'alice@example.com', password: '12345678' } )
								.end( function ( e, res ) {
									alicesToken = res.body.token;
									done();
								} );
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
			.set( 'Authorization', 'Bearer ' + bobsToken )
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
			.set( 'Authorization', 'Bearer ' + bobsToken )
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
			.set( 'Authorization', 'Bearer ' + bobsToken )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 200 );
				expect( res.body ).to.have.property( 'groups' );
				expect( res.body.groups ).to.be.an( 'array' );
				expect( res.body.groups ).to.have.length( 1 );
				// TODO: Expect not to have certain properties
				// we don't need all sessions and members at this
				// point, for example
				done();
			} );
	} );

	it( 'should return details of a particular group', function ( done ) {
		// First get all groups and then details of one
		superagent
			.get( testUrl )
			.set( 'Authorization', 'Bearer ' + bobsToken )
			.end( function ( e, res ) {
				var groupUrl = testUrl + res.body.groups[ 0 ]._id;
				superagent
					.get( groupUrl )
					.set( 'Authorization', 'Bearer ' + bobsToken )
					.end( function ( e, res ) {
						var group = res.body;
						expect( group ).to.have.property( 'name' );
						expect( group.name ).to.be( 'Test Group' );
						expect( group ).to.have.property( 'admins' );
						expect( group.admins ).to.be.an( 'array' );
						expect( group ).to.have.property( 'members' );
						expect( group.members ).to.be.an( 'array' );
						// TODO: expect( group ).to.have.property( 'brainstorms' );
						done();
					} );
			} );

	} );

	it( 'should only return details of groups that the user is part of' );
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
		// TODO: Remove all the groups that were created
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
