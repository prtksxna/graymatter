require( '../models/group' );
require( '../models/user' );

var
	request = require( 'superagent' ),
	expect = require( 'expect.js' ),
	mongoose = require( '../models/db' ),
	Group = mongoose.model( 'Group' ),
	User = mongoose.model( 'User' ),
	config = require( '../config/config.js' ),
	testUrl = config.dev.api + 'groups/';

describe( 'Group API', function () {
	var bobsId, alicesId, bobsToken, alicesToken, testGroupId;

	before( function ( done ) {
		var bob, saveBob, loginBob, alice, saveAlice, loginAlice;

		console.log( '  > Creating first test user - bob@example.com' );
		bob = new User();
		bob.email = 'bob@example.com';
		bob.setPassword( '12345678' );
		saveBob = bob.save().then( function ( user ) {
			console.log( '  > Created bob!' );
			bobsId = user.id;

			console.log( '  > Logging in bob@example.com' );
			return request
				.post( config.dev.api + 'sessions/new' )
				.send( { email: 'bob@example.com', password: '12345678' } )
				.then( function ( res ) {
					return res.body.token;
				} );
		} );

		console.log( '  > Creating second test user - alice@example.com' );
		alice = new User();
		alice.email = 'alice@example.com';
		alice.setPassword( '12345678' );
		saveAlice = alice.save().then( function ( user ) {
			console.log( '  > Created alice!' );
			alicesId = user.id;

			console.log( '  > Logging in alice@example.com' );
			return request
				.post( config.dev.api + 'sessions/new' )
				.send( { email: 'alice@example.com', password: '12345678' } )
				.then( function ( res ) {
					return res.body.token;
				} );
		} );

		Promise.all( [ saveBob, saveAlice ] ).then( function ( tokens ) {
			bobsToken = tokens[ 0 ];
			alicesToken = tokens[ 1 ];
			done();
		} );
	} );

	it( 'should not return a list if user is not authenticated', function ( done ) {
		request
			.get( testUrl )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 401 );
				done();
			} );
	} );

	it( 'should not let you add an group if user is not authenticated', function ( done ) {
		request
			.post( testUrl )
			.send( { name: 'Test Group' } )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 401 );
				done();
			} );
	} );

	it( 'should not let you add a new group without a name', function ( done ) {
		request
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
		request
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
		request
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
		request
			.get( testUrl )
			.set( 'Authorization', 'Bearer ' + bobsToken )
			.end( function ( e, res ) {
				testGroupId = res.body.groups[ 0 ]._id;
				request
					.get( testUrl + testGroupId )
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

	it( 'should not show details of a group if a non-member/admin requests it', function ( done ) {
		request
			.get( testUrl + testGroupId )
			.set( 'Authorization', 'Bearer ' + alicesToken )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 404 );
				done();
			} );
	} );

	it( 'should let user add members', function ( done ) {
		request
			.post( testUrl + testGroupId + '/add_member' )
			.set( 'Authorization', 'Bearer ' + bobsToken )
			.send( { userId: alicesId } )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 200 );
				expect( res.body.members ).to.contain( alicesId );
				expect( res.body.members ).to.have.length( 1 );
				done();
			} );
	} );

	it( 'should let users see groups that they are members of', function ( done ) {
		request
			.get( testUrl )
			.set( 'Authorization', 'Bearer ' + alicesToken )
			.end( function ( e, res ) {
				var groups = res.body;
				expect( res.status ).to.be( 200 );
				expect( res.body ).to.have.property( 'groups' );
				expect( res.body.groups ).to.be.an( 'array' );
				expect( res.body.groups ).to.have.length( 1 );
				done();
			} );
	} );

	it( 'should only return details of groups that the user is part of' );
	it( 'should check if the returned list has groups both member and admin of' );
	it( 'should let members remove themselves from a group' );
	it( 'should let admins make members admin' );
	it( 'should let admins remove members as admin' );
	it( 'should let admins remove admins as admin' );
	it( 'should let admins make themselves members' );
	it( 'should make sure an group is not admin-less' );
	it( 'should not let admin remove themselves (they need to un-admin first)' );

	after( function ( done ) {
		var removeBob, removeAlice;

		// TODO: Remove all the groups that were created
		console.log( '  > Looking for test user - bob@example.com' );
		removeBob = User.remove( { email: 'bob@example.com' } ).then( function ( user ) {
			console.log( '  > Removed test user - bob@example.com' );
		} );

		console.log( '  > Looking for test user - alice@example.com' );
		removeAlice = User.remove( { email: 'alice@example.com' } ).then( function ( user ) {
			console.log( '  > Removed test user - alice@example.com' );
		} );

		Promise.all( [ removeBob, removeAlice ] ).then( function () {
			mongoose.disconnect().then( done );
		} );
	} );

} );
