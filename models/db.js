var
	mongoose = require( 'mongoose' ),
	config = require( '../config/config.js' );

// TODO: How would we handle this in prod?
// ANS: Environment variables
mongoose.Promise = global.Promise;
mongoose.connect( config.dev.db );

module.exports = mongoose;
