module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		jshint: {
			routes: 'routes/*.js',
			tests: 'tests/*.js',
			models: 'models/*.js',
			all: [ 'routes/*.js', 'tests/*.js', 'models/*.js', 'app.js' ]
		}
	} );
};
