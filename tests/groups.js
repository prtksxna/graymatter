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

	it( 'should not return a list of groups owned by the user', function ( done ) {
		superagent
			.get( testUrl )
			.set( 'Authorization', 'Bearer ' + token )
			.end( function ( e, res ) {
				expect( res.status ).to.be( 200 );
				expect( res.body ).to.have.property( 'groups' );
				expect( res.body.groups ).to.be.an( 'array' );
				done();
			} );
	} );

	it( 'should be able to create a new group' );

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
