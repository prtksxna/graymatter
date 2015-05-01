var superagent = require('superagent');
var expect = require('expect.js');

describe( 'ideas api' , function () {
	it( 'should return an array of all ideas', function( done ) {
		superagent
			.get( 'http://localhost:3000/ideas' )
			.end( function( e, res ) {
				expect( res.body).to.be.an( 'array' );
				done();
			} );
	} );
} );
