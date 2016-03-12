// *Attached to `/groups`*
require( '../models/group' );

var
	config = require( '../config/config.js' ),
	express = require( 'express' ),
	router = express.Router(),
	mongoose = require( 'mongoose' ),
	Group = mongoose.model( 'Group' ),
	jwt = require( 'express-jwt' ),
	auth = jwt( {
		secret: config.dev.secret,
		userProperty: 'payload'
	} );

router.get( '/', auth, function ( req, res, next ) {
	Group.find( { owner: req.payload.id }, function ( err, groups ) {

		return res.json( {
			groups: groups
		} );
	} );
} );

module.exports = router;
