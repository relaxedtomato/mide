'use strict';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var path = require('path');
var SESSION_SECRET = require(path.join(__dirname, '../../env')).SESSION_SECRET;

module.exports = function (app) {

    // Important to have this before any session middleware
    // because what is a session without a cookie?
    // No session at all.
    app.use(cookieParser());

    // Parse our POST and PUT bodies.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //TODO: Fix for Production
    //if (process.env.NODE_ENV === 'production') {
    //app.use(expressJwt({secret:SESSION_SECRET}).unless({path: ['/api/user/login','/api/user/signup']}));
    //} else {
        //do nothing
    //}

};