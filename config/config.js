// ## Configuration
// > TODO: This isn't how the config should be, but it will do for
// > now. We should probably do something like -
// > http://www.chovy.com/node-js/managing-config-variables-inside-a-node-js-application/
var config = {
	dev: {
		// > TODO: Rename this to hostname
		api: 'http://localhost:3000/',
		db: 'mongodb://localhost/graymatter',
		// > TODO: In production this secret needs to be better and longer
		secret: 'secret'
	},
	googleAuth: {
		// > TOOD: These should be a secret and not checked into version control
		clientID: '954841278741-tapbjff3qm8c67ubfhei1oal9jvsk0p8.apps.googleusercontent.com',
		clientSecret: 'bD0kKRspQYs9vwdP7tKBnV98',
		callbackURL: 'http://localhost:3000/sessions/google/callback'
	}
};

module.exports = config;
