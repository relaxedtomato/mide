'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/challenge', require('./challenge'));
router.use('/user', require('./user')); //these are not restricted, anyone can access
router.use('/gists', require('./gists'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});