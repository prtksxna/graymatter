var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

/* Attached to /users */

router.post( '/new', function( req, res, next ) {
	if( !req.body.username || !req.body.password ){
		return res
			.status( 400 )
			.json( {
				message: 'Please fill out all fields'
			} );
	}
} );

module.exports = router;
