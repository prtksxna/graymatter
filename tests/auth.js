var superagent = require('superagent');
var expect = require('expect.js');

var mongoose = require( 'mongoose' );
require( '../models/user' );
var User = mongoose.model('User');

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
