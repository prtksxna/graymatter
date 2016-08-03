// ## Index route

var
	express = require( 'express' ),
	router = express.Router();

// > TODO: Placeholder for index
router.get( '/', function ( req, res, next ) {
	res.json( {
		message: 'This is an API'
	} );
} );

module.exports = router;
