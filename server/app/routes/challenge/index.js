// 'use strict';
var router = require('express').Router();
var codewars = require('../../api/codewars');
module.exports = router;

//TODO: Express JWT, will place decoded token on user object, so req.user is accessible

//Get a code challenge
router.get('/:id', function (req, res, next) {
	//req.params.id is the Codewars API Key
	//TODO: Store all challenges in mongo for future reference

	//console.log('api/challenge',req.user);
	//codewars.postSpecificChallenge().then(function(challenge){
	codewars.postNextChallenge(req.params.id).then(function(challenge){
		res.json(challenge);
	}).catch(function(err){
		return next(err);
	});
});


router.post('/', function (req, res, next) {
	res.json(message);
});

//Submit Solution
router.post('/submit/:id', function (req, res, next) {
	//TODO: Keep track of successfully completed problems
	codewars.submitSubmission(req.params.id, req.body.projectId, req.body.solutionId, req.body.code).then(function(finalized){
		res.json(finalized);
	});
});

//Attempt Solution
router.post('/attempt/:id', function (req, res, next) {
	//TODO: provide attemptSolution params, default is a test
	codewars.testSubmission(req.params.id, req.body.projectId, req.body.solutionId, req.body.code).then(function(attempt){
		res.json(attempt);
		// if(attempt.success){
		// 	res.json({success:attempt.success,dmid:attempt.dmid});
		// } else {
		// 	console.log('error handling for incorrect solution'); //TODO:
		// }
	});
});


router.put('/', function (req, res, next) {
	var message = "put route for challenge";
	res.json(message);
});

