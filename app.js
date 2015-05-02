var express = require( 'express' );
var path = require( 'path' );
var logger = require( 'morgan' );
var bodyParser = require( 'body-parser' );

var mongoose = require( 'mongoose' );
require( './models/idea' );
require( './models/vote' );
require( './models/user' );
mongoose.connect( 'mongodb://localhost/graymatter' );

var passport = require('passport');
require('./config/passport');

var routes = require( './routes/index' );
var users = require( './routes/users' );

var app = express();
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( passport.initialize() );
app.use( '/', routes );


// Error Handling

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next(err);
} );

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
	app.use( function( err, req, res, next ) {
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
app.use( function( err, req, res, next ) {
	res.status( err.status || 500 );
	res.json( {
		message: err.message,
		error: {}
	} );
} );


module.exports = app;
