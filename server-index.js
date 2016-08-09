'use strict';

const Hapi = require('hapi');
const Joi = require('joi');

//Create server and connection
const server = new Hapi.Server({
  // to use redis server as cache
  // *****************************
  cache: [{
    engine: require('catbox-redis'),
    name: 'redis-cache'
  }]
  // *****************************
});
server.connection({
    port: 3000
});

const add = (a, b, callback) => {
  return callback(null, a + b);
};

server.method('sum', add, {
  cache: {
    expiresIn: 5000,
    generateTimeout: 100,
    cache: 'redis-cache'  // to use redis server as cache
  }
});

// route to perform add function and store value in memory
server.route({
  method: 'GET',
  path: '/{a}/{b}',
  handler: function(request, reply) {

    server.methods.sum(request.params.a, request.params.b, (err, result) => {

      if (err) {
        throw err;
      }

      return reply(result);
    });
  },
  config: {
    validate: {
      params: {
        a: Joi.number(),
        b: Joi.number()
      }
    }
  }
});

// route to read sum value from memory
server.route({
  method: 'GET',
  path: '/stats',
  handler: function (request, reply) {

    return reply(server.methods.sum.cache);
  }
})

//Register good plugin and start the server
server.register({
    register: require('good'),
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    log: '*',
                    response: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err;
    }

    // Starting the server
    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});
