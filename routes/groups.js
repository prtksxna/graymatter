// ## Groups route
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

// Everything in this path should be accessed
// by an authenticated user.
router.use( auth );

// Middleware function that gets the group by its id and returns
// it only if the currently logged in user is a member of it.
router.use( '/:id*', function ( req, res, next ) {
	Group.findById( req.params.id ).exec().then( function ( group ) {
		if ( group.canBeSeenBy( req.payload._id ) ) {
			req.group = group;
			next();
		} else {
			return res.status( 404 ).send();
		}
	} ).then( null, next );
} );

// > TODO: Document everything here
router.post( '/', function ( req, res, next ) {
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

router.get( '/', function ( req, res, next ) {
	Group.findByUser( req.payload._id ).then( function ( groups ) {
		return res.json( { groups: groups } );
	} ).then( null, function ( err ) {
		return next( err );
	} );
} );

router.get( '/:id', function ( req, res, next ) {
	return res.json( req.group );
} );

router.post( '/:id/add_member', function ( req, res, next ) {
	if ( req.group.hasAdmin( req.payload._id ) ) {
		req.group.addMember( req.body.userId ).then( function ( group ) {
			return res.status( 200 ).json( group );
		} );
	}
} );

module.exports = router;
