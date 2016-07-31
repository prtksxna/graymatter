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

	group.save().then( function ( group ) {
		return res.status( 201 ).json( group );
	} ).then( null, function ( err ) {
		return res.status( 400 ).json( err );
	} );
} );

router.get( '/', auth, function ( req, res, next ) {
	Group.findByUser( req.payload._id ).then( function ( groups ) {
		return res.json( { groups: groups } );
	} ).then( null, function ( err ) {
		return res.status( 500 ).json( err );
	} );
} );

router.get( '/:id', auth, function ( req, res, next ) {
	Group.findById( req.params.id ).exec().then( function ( group ) {
		if ( group.canBeSeenBy( req.payload._id ) ) {
			return res.json( group );
		} else {
			return res.status( 404 ).send();
		}
	} ).then( null, function ( err ) {
		return res.status( 500 ).json( err );
	} );
} );

router.post( '/:id/add_member', auth, function ( req, res, next ) {
	Group.findById( req.params.id ).exec().then( function ( group ) {
		if ( group.hasAdmin( req.payload._id ) ) {
			group.addMember( req.body.userId ).then( function ( group ) {
				return res.status( 200 ).json( group );
			} );
		}
	} ).then( null, function ( err ) {
		return res.status( 404 ).json( err );
	} );
} );

module.exports = router;
