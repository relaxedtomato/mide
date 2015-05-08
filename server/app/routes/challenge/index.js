'use strict';
var router = require('express').Router();
var codewars = require('../../api/codewars');
module.exports = router;

//Get a code challenge
router.get('/', function (req, res, next) {
	//TODO: Change to postNextChallenge for Random (for first Build/Release)
	//TODO: Store all challenges in mongo for future reference
	codewars.postSpecificChallenge().then(function(challenge){
		res.send(challenge);
	});
});

//Attempt Solution
router.post('/', function (req, res, next) {
	//TODO: provide attemptSolution params, default is a test
	codewars.attemptSolution().then(function(attempt){
		var attempt = JSON.parse(attempt[0].body);
		if(attempt.success){
			res.send({success:attempt.success,dmid:attempt.dmid});
		} else {
			console.log('error handling for incorrect solution'); //TODO:
		}
	});
});

//Finalize Solution
router.put('/', function (req, res, next) {
	var message = "put route for challenge";

	//TODO: Keep track of successfully completed problems
	codewars.finalizeSolution().then(function(finalized){
		//console.log('here');
		res.send(finalized[0].body);
	});

});

