'use strict';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
//TODO: Should be a ENV Variable
var jwtSecret = 'blahblahblah'; //encoded json object (token), token sends it back on each request

module.exports = function (app) {

    // Important to have this before any session middleware
    // because what is a session without a cookie?
    // No session at all.
    app.use(cookieParser());

    // Parse our POST and PUT bodies.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(expressJwt({secret:jwtSecret}).unless({path: ['/api/user/login','/api/user/signup']}));
};