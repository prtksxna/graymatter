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

	it( 'should let the user login' );

	after( function ( done ) {
		mongoose.disconnect();
		done();
	} );

} );
