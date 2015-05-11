// 'use strict';
var router = require('express').Router();
var codewars = require('../../api/codewars');
module.exports = router;

//TODO: Express JWT, will place decoded token on user object, so req.user is accessible

//Get a code challenge
router.get('/', function (req, res, next) {
	//TODO: Change to postNextChallenge for Random (for first Build/Release)
	//TODO: Store all challenges in mongo for future reference
	//console.log('api/challenge',req.user);
	codewars.postSpecificChallenge().then(function(challenge){
		res.json(challenge);
	});
});


router.post('/', function (req, res, next) {
	var message = "This is a code challenge";
	res.json(message);
});

//Finalize Solution
router.post('/submit', function (req, res, next) {
	//var message = "You created a submission for a code challenge";
	//res.json(message);
	//var message = "put route for challenge";

	//TODO: Keep track of successfully completed problems
	codewars.finalizeSolution().then(function(finalized){
		//console.log('here');
		res.json(finalized .body);
	});
});

//Attempt Solution
router.post('/attempt', function (req, res, next) {
	//var message = "You created submitted your solution for testing a code challenge";
	//res.json(message);
	//TODO: provide attemptSolution params, default is a test
	codewars.attemptSolution().then(function(attempt){
		var attempt = JSON.parse(attempt[0].body);
		if(attempt.success){
			res.json({success:attempt.success,dmid:attempt.dmid});
		} else {
			console.log('error handling for incorrect solution'); //TODO:
		}
	});
	//var message = "This is a code challenge";
	//res.json(message);
});


router.put('/', function (req, res, next) {
	var message = "put route for challenge";
	res.json(message);
});

