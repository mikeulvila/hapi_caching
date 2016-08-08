'use strict';

const Hapi = require('hapi');
const Joi = require('joi');

//Create server and connection
const server = new Hapi.Server();
server.connection({
    port: 3000
});

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