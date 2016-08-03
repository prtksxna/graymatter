// # Graymatter
// We generate a single page documentation for the server-side code
// and this is the starting point. Refer to `Gruntfile.js` to find
// out which files are included.

var
	// HTTP server and its modules
	express = require( 'express' ),
	logger = require( 'morgan' ),
	bodyParser = require( 'body-parser' ),
	// This file sets up a mongoose connection
	mongoose = require( './models/db.js' ),
	// Passport authenticaton and config
	passport = require( 'passport' ),
	user = require( './models/user' ),
	passportConfig = require( './config/passport' ),
	// Routes
	index = require( './routes/index' ),
	users = require( './routes/users' ),
	sessions = require( './routes/sessions' ),
	groups = require( './routes/groups' ),

	app = express();

// Setting up express middleware
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( passport.initialize() );

// Setting up routes
app.use( '/', index );
app.use( '/users', users );
app.use( '/sessions', sessions );
app.use( '/groups', groups );

module.exports = app;
