// *Attached to `/users`*

var
	express = require('express'),
	router = express.Router(),
	mongoose = require( 'mongoose' ),
	passport = require( 'passport' ),
	User = mongoose.model( 'User' );

// ## New Sessions

// **POST: /sessions/new**
// ```
// {
//   email: 'bob@example.com',
//   password: '12345678'
// }
// ```
router.post( '/new', function ( req, res, next ) {
	User.findOne( { email: req.body.email, password: req.body.password }, function ( err, user ) {
		console.log( user );
		return res
			.json( user );
	} );
} );

module.exports = router;
