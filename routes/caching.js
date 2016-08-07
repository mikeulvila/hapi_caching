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

  return next();
};

exports.register.attributes = {
  name: 'routes-caching'
};
