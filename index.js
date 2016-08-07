'use strict';

const Hapi = require('hapi');

// create server and connection
const server = new Hapi.Server();
server.connection({
  port: 3000
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
