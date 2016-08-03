module.exports = function ( grunt ) {

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
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
		// This is to generate single page docs
		concat: {
			server: {
				src: [
					'app.js',
					'config.js',
					'passport.js',
					'models/user.js',
					'models/group.js',
					'routes/index.js',
					'routes/users.js',
					'routes/sessions.js',
					'routes/groups.js',
					'Gruntfile.js'
				],
				dest: 'docs/server.js'
			}
		},
		docco: {
			server: {
				src: 'docs/server.js',
				options: {
					output: 'docs/'
				}
			}
		},
		clean: {
			server: [ 'docs/server.js' ]
		},
		watch: {
			options: {
				// Prevent grunt from taking up all CPU
				// http://git.io/vJwSS and http://git.io/AF4m
				// interval: 5007
			},
			files: '**/*.js',
			tasks: [ 'test', 'docs' ]
		},
		githooks: {
			all: {
				'pre-commit': 'test'
			}
		}
	} );

	grunt.registerTask( 'docs', [ 'concat:server', 'docco:server', 'clean:server' ] );
	grunt.registerTask( 'test', [ 'express:dev', 'mochaTest', 'jshint:all', 'jscs:all' ] );

};
