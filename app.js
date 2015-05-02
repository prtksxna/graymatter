var express = require( 'express' );
var path = require( 'path' );
var logger = require( 'morgan' );
var bodyParser = require( 'body-parser' );

var mongoose = require( 'mongoose' );
require( './models/idea' );
require( './models/vote' );
require( './models/user' );

var passport = require('passport');
require('./config/passport');


var routes = require( './routes/index' );
var users = require( './routes/users' );

var app = express();
mongoose.connect( 'mongodb://localhost/graymatter' );

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico' ));
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( passport.initialize() );

app.use( '/', routes );

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next(err);
} );

// error handlers

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
