require( './models/user' );
require( './config/passport' );

var
	express = require( 'express' ),
	logger = require( 'morgan' ),
	bodyParser = require( 'body-parser' ),
	mongoose = require( './models/db.js' ),
	passport = require( 'passport' ),
	index = require( './routes/index' ),
	users = require( './routes/users' ),
	sessions = require( './routes/sessions' ),
	groups = require( './routes/groups' ),
	app = express();

app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( passport.initialize() );

app.use( '/', index );
app.use( '/users', users );
app.use( '/sessions', sessions );
app.use( '/groups', groups );

module.exports = app;
