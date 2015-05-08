'use strict';
var router = require('express').Router();
module.exports = router;

//Get a code challenge
router.get('/', function (req, res, next) {
	var message = "This is a code challenge";
	res.json(message);
});

router.post('/submit', function (req, res, next) {
	var message = "You created a submission for a code challenge";
	res.json(message);
});

router.post('/test', function (req, res, next) {
	var message = "You created submitted your solution for testing a code challenge";
	res.json(message);
});

router.put('/', function (req, res, next) {
	var message = "put route for challenge";
	res.json(message);
});

