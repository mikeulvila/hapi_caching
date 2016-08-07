'use strict';

// crypto is part of node
const crypto = require('crypto');

exports.register = function (server, options, next) {


  return next();
};

exports.register.attributes = {
  name: 'routes-caching'
};
