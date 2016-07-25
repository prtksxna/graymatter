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

router.post( '/', auth, function ( req, res, next ) {
	var group = new Group( {
		name: req.body.name,
		admins: [ req.payload._id ]
	} );

	group.save( function ( err, next ) {
		return res.status( 201 ).json( group );
	} );
} );

router.get( '/', auth, function ( req, res, next ) {
	// TODO If this is meant to return all groups, we need to run two queries
	Group.find( { owner: req.payload.id }, function ( err, groups ) {

		return res.json( {
			groups: groups
		} );
	} );
} );

module.exports = router;
