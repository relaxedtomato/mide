// 'use strict';
var router = require('express').Router();
var codewars = require('../../api/codewars');
module.exports = router;

//Get a code challenge
router.get('/:id', function (req, res, next) {
	//req.params.id is the Codewars API Key
	//TODO: Store all challenges in mongo for future reference
	codewars.postNextChallenge(req.params.id).then(function(challenge){
		res.json(challenge);
	}).catch(function(err){
		return next(err);
	});
});


router.post('/', function (req, res, next) {
	var message = "This is a code challenge";
	res.json(message);
});

//Submit Solution
router.post('/submit/:id', function (req, res, next) {
	//TODO: Keep track of successfully completed problems
	console.log(req.params.id, req.body);
	codewars.submitSubmission(req.params.id, req.body.projectId, req.body.solutionId, req.body.code).then(function(finalized){
		//console.log('here');
		// res.json(finalized .body);
		console.log(finalized);
	});
});

//Attempt Solution
router.post('/attempt/:id', function (req, res, next) {
	console.log(req.params.id, req.body);
	//TODO: provide attemptSolution params, default is a test
	codewars.testSubmission(req.params.id, req.body.projectId, req.body.solutionId, req.body.code).then(function(attempt){
		console.log(attempt);
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

