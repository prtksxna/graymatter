module.exports = function ( grunt ) {

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-mocha-test' );
	grunt.loadNpmTasks( 'grunt-express-server' );
	grunt.loadNpmTasks( 'grunt-docco' );
	grunt.loadNpmTasks( 'grunt-githooks' );

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
			all: [ 'config/*.js', 'routes/*.js', 'tests/*.js', 'models/*.js', 'app.js', 'Gruntfile.js' ]
		},
		jscs: {
			routes: 'routes/*.js',
			tests: 'tests/*.js',
			models: 'models/*.js',
			all: [ 'config/*.js', 'routes/*.js', 'tests/*.js', 'models/*.js', 'app.js', 'Gruntfile.js' ],
			options: {
				config: '.jscsrc',
				disallowDanglingUnderscores: null
			}
		},
		mochaTest: {
			test: {
				src: 'tests/**/*.js'
			}
		},
		docco: {
			api: {
				src: 'routes/**/*.js',
				options: {
					output: 'docs/'
				}
			}
		},
		watch: {
			options: {
				// Prevent grunt from taking up all CPU
				// http://git.io/vJwSS and http://git.io/AF4m
				interval: 5007
			},
			files: '**/*.js',
			tasks: [ 'test', 'docco:api' ]
		},
		githooks: {
			all: {
				'pre-commit': 'test'
			}
		}
	} );

	grunt.registerTask( 'test', [ 'express:dev', 'mochaTest', 'jshint:all', 'jscs:all' ] );

};
