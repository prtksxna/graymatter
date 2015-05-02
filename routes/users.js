// *Attached to `/users`*

var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );


// ## New User
// `POST` email and password in JSON to `/users/new`/ to create a new user.
// ```
// { email: 'bob@example.com', password: '123456' }
// ```
router.post( '/new', function( req, res, next ) {
	// It will return a `400` if either of them is missing
	if( !req.body.email || !req.body.password ){
		return res
			.status( 400 )
			.json( {
				message: 'Please fill out all fields'
			} );
	}
} );

module.exports = router;
