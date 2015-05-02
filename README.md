# The API

## Quickstart

API for user registration and authentication. To use, install dependencies and start the server-

```
$ npm install
$ mongod
$ node ./bin/www
```

See the mocha tests to understand how to use the API.


## Development

For development, run `grunt watch`. It reloads the server if any changes are made, and runs mocha tests and jslint.


## Directory structure

 * `bin`: Has the server start script
 * `config`: Has the passport strategies
 * `models`: Has mongoose models
 * `routes`: Has express routes
 * `tests`: Has mocha tests