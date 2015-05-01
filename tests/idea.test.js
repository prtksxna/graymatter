var superagent = require('superagent');
var expect = require('expect.js');

describe( 'Ideas API' , function () {
	it( 'should return an array of all ideas', function( done ) {
		superagent
			.get( 'http://localhost:3000/ideas' )
			.end( function( e, res ) {
				expect( res.body).to.be.an( 'array' );
				done();
			} );
	} );

	it( 'should return an idea id', function ( done ) {
		superagent
			.get( 'http://localhost:3000/ideas' )
			.end( function ( e, res ) {
				expect( res.body[0] ).to.have.property( '_id' );
				done();
			} );
	} );
} );
