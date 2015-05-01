module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		jshint: {
			routes: 'routes/*.js',
			tests: 'tests/*.js',
			models: 'models/*.js',
			all: [ 'routes/*.js', 'tests/*.js', 'models/*.js', 'app.js' ]
		},
		watch: {
			files: '**/*.js',
			tasks: [ 'jshint:all' ]
		}
	} );

};
