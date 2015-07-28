var config = {
	dev: {
		api: 'http://localhost:3000/',
		db: 'mongodb://localhost/graymatter',
		secret: 'TODO: Secret'
	},
	googleAuth: {
		clientID: '954841278741-tapbjff3qm8c67ubfhei1oal9jvsk0p8.apps.googleusercontent.com',
		clientSecret: 'bD0kKRspQYs9vwdP7tKBnV98',
		callbackURL: 'http://localhost:3000/sessions/google/callback'
	}
};

module.exports = config;
