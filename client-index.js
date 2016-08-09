'use strict';

const Hapi = require('hapi');

// create server and connection
const server = new Hapi.Server();
server.connection({
  port: 3000
});

// route to demonstrate storing cookies
server.state('data', {
  encoding: "base64json"
});

server.route({
  method: 'GET',
  path: '/cookie',
  handler: function(request, reply) {

    let counter = 0;

    if (request.state.data) {
      counter = request.state.data.counter;
    }

    return reply(`Hello cookies! Showed ${counter} times.`).state('data', {
      counter: counter + 1
    });

  },
  config: {
    state: {
      parse: true,
      failAction: 'ignore' //may also be 'error' or 'log'
    }
  }
});

// register good plugin and start server
server.register([{
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
}, {
  register: require('inert')
}, {
  register: require('./routes/client-caching')
}], (err) => {

  if (err) {
    throw err;
  }

  // start server
  server.start(err => {

    if (err) {
      throw err;
    }

    console.log('Server running at: ', server.info.uri);
  });
});
