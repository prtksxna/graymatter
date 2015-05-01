module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		jshint: {
			routes: 'routes/*.js',
			tests: 'tests/*.js',
			models: 'models/*.js',
			all: [ 'routes/*.js', 'tests/*.js', 'models/*.js', 'app.js' ]
		},
		mochaTest: {
			test: {
				src: 'tests/**/*.js'
			}
		},
		watch: {
			files: '**/*.js',
			tasks: [ 'mochaTest', 'jshint:all' ]
		}
	} );

};
