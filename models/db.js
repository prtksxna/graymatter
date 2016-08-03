var
	mongoose = require( 'mongoose' ),
	config = require( '../config/config.js' );

// TODO: How would we handle this in prod?
// ANS: Environment variables
mongoose.Promise = global.Promise;
mongoose.connect( config.dev.db );

process.on( 'SIGINT', function () {
	mongoose.connection.close( function () {
		console.log( 'Mongoose connection terminated' );
		process.exit( 0 );
	} );
} );

module.exports = mongoose;
