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
		if ( err ) {
			return res.status( 400 ).json( err );
		}
		return res.status( 201 ).json( group );
	} );
} );

router.get( '/', auth, function ( req, res, next ) {
	// TODO If this is meant to return all groups, we need to run two queries
	Group
		.find( {
			admins: { $in: [ req.payload._id ] }
		} )
		.exec( function ( err, groups ) {
			if ( err ) {
				return res.status( 500 ).json( err );
			}

			return res.json( {
				groups: groups
			} );
		} );
} );

router.get( '/:id', auth, function ( req, res, next ) {
	Group.findById( req.params.id, function ( err, group ) {
		if ( err ) {
			return res.status( 500 ).json( err );
		}
		return res.json( group );
	} );
} );

module.exports = router;
