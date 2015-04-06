var express = require( 'express' );
var router = express.Router();

var mongoose = require( 'mongoose' );
var Idea = mongoose.model( 'Idea' );
var Vote = mongoose.model( 'Vote' );

/* GET home page. */
router.get( '/', function ( req, res, next ) {
	res.render( 'index', {
		title: 'Express'
	} );
} );

router.get( '/ideas', function ( req, res, next ) {
	Idea.find( function ( err, ideas ) {
		if ( err ) {
			next( err );
		}
		res.json( ideas );
	} );
} );

router.post( '/ideas', function ( req, res, next ) {
	var idea = new Idea( req.body );

	idea.save( function ( err, idea ) {
		if ( err ) {
			next( err );
		}

		res.json( idea );
	} );
} );

router.param( 'idea', function( req, res, next, id ) {
	var query = Idea.findById( id );

	query.exec( function ( err, idea ) {
		if ( err ) {
			next( err );
		}

		if ( !idea ) {
			return next( new Error( 'can\'t find Idea' ) );
		}

		req.idea = idea;
		return next();
	} );
} );

router.get( '/ideas/:idea', function( req, res, next ) {
	res.json( req.idea );
} );

module.exports = router;
