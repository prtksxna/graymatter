module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		express: {
			dev: {
				options: {
					delay: 1000,
					script: './bin/www'
				}
			}
		},
		jshint: {
			routes: 'routes/*.js',
			tests: 'tests/*.js',
			models: 'models/*.js',
			all: [ 'config/*.js', 'routes/*.js', 'tests/*.js', 'models/*.js', 'app.js' ]
		},
		mochaTest: {
			test: {
				src: 'tests/**/*.js'
			}
		},
		watch: {
			files: '**/*.js',
			tasks: [ 'express:dev', 'test' ]
		}
	} );

	grunt.registerTask( 'test', [ 'mochaTest', 'jshint:all' ] );

};
