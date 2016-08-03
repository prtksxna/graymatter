// ## Database
// We use mongoose, which is a driver for MongoDB.

var
	mongoose = require( 'mongoose' ),
	config = require( '../config/config.js' );

// Mongoose's internal promise object is depracated.
mongoose.Promise = global.Promise;
// > TODO: This should change according to the environment
// > in which we are running. The tests should also use a
// > different database.
mongoose.connect( config.dev.db );

// Kill the database connection when the app is stopped.
process.on( 'SIGINT', function () {
	mongoose.connection.close( function () {
		console.log( 'Mongoose connection terminated' );
		process.exit( 0 );
	} );
} );

module.exports = mongoose;
