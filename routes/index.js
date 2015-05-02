var express = require( 'express' );
var router = express.Router();

var mongoose = require( 'mongoose' );

/* GET home page. */
router.get( '/', function ( req, res, next ) {
	res.json( {
		message: 'This is an API'
	} );
} );

router.post( '/register', function( req, res, next ) {
	if( !req.body.username || !req.body.password ){
		return res
			.status( 400 )
			.json( {
				message: 'Please fill out all fields'
			} );
	}
} );

module.exports = router;
