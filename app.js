require( './models/user' );
require('./config/passport');

var
	express = require( 'express' ),
	path = require( 'path' ),
	logger = require( 'morgan' ),
	bodyParser = require( 'body-parser' ),
	mongoose = require( 'mongoose' ),
	passport = require('passport'),
	routes = require( './routes/index' ),
	users = require( './routes/users' ),
	sessions = require( './routes/sessions' ),
	config = require( './config/config.js' ),
	app = express();

// TODO: How would we handle this in prod?
mongoose.connect( config.dev.db );

app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( passport.initialize() );

app.use( '/', routes );
app.use( '/users', users );
app.use( '/sessions', sessions );

// Error Handling
// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next(err);
} );

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
	app.use( function ( err, req, res, next ) {
		res.status( err.status || 500 );
		res.json( {
			message: err.message,
			error: {
				status: err.status,
				stack: err.stack
			}
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
	res.status( err.status || 500 );
	res.json( {
		message: err.message,
		error: {}
	} );
} );

module.exports = app;
