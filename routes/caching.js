'use strict';

// crypto is part of node
const crypto = require('crypto');

exports.register = function (server, options, next) {

  const _createHash = (input) => {

    const jsonString = JSON.stringify(input);

    return crypto.createHash('sha1').update(jsonString).digest('hex');
  };

  server.route({
    method: 'GET',
    path: '/logo.png',
    handler: {
      file: './public/hapi_logo.png'
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      const response = 'Hi with Cach-Control and Etag!';
      const etag = _createHash(response);

      return reply(response).etag(etag);
    },
    config: {
      cache: {
        expiresIn: 30 * 1000,
        privacy: 'private'
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-caching'
};
