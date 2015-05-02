# The API

## Quickstart

API for user registration and authentication. To use, install dependencies and start the server-

```
$ npm install
$ mongod
$ node ./bin/www
```

To generate the API's documentation, run-

```
$ grunt docco:api
```


## Development

For development, run `grunt watch`. It reloads the server if any changes are made, runs mocha tests and jslint, and generates documentation.


## Directory structure

 * `bin`: Has the server start script
 * `config`: Has the passport strategies
 * `models`: Has mongoose models
 * `routes`: Has express routes
 * `tests`: Has mocha tests