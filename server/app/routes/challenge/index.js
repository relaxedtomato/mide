'use strict';
var router = require('express').Router();
module.exports = router;

//Get a code challenge
router.get('/', function (req, res, next) {
	var message = "This is a code challenge";
	res.send(message);
});

router.post('/', function (req, res, next) {
	var message = "You posted a code challenge";
	res.send(message);
});

router.get('/', function (req, res, next) {
	var message = "This is a code challenge";
	res.send(message);
});

