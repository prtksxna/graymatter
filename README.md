# The API

## Quickstart

API for user registration and authentication.

To use, first install dependencies-
```
$ npm install
```

Then start the Mongo and Node servers-
```
$ mongod
$ node ./bin/www
```

To generate the API's documentation, run-
```
$ grunt docco:api
```

To run all tests, run-
```
$ grunt test
```


## Development

For development, run `grunt watch`. It reloads the server if any changes are made, runs mocha tests and jslint, and generates documentation.
Run `grunt githooks` to set up a pre-commit hook that will test everything before you can commit it.


## Directory structure

 * `bin`: Has the server start script
 * `config`: Has the passport strategies
 * `models`: Has mongoose models
 * `routes`: Has express routes
 * `tests`: Has mocha tests