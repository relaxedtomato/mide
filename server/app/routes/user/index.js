// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
module.exports = router;

//sign up
router.post('/signup', function(req, res, next) {
	//var newUser = req.body;
	console.log('data',req.body);
	// if (newUser.password !== newUser.passwordConfirm) {
	// 	var error = new Error('Passwords do not match');
	// 	error.status = 401;
	// 	return next(error);
	// }
	UserModel.create(req.body).then(userCreated, userNotCreated);

	//TODO: Currently you can create multiple non-unique users
	function userCreated(userdata){
		console.log('userCreated');
		//res.sendStatus(200);
		res.send({user: _.omit(userdata.toJSON(),['email','salt','password','admin','_id', 'apiKey','__v']) });
	}

	function userNotCreated(){
		res.sendStatus(401);
		//TODO: Error Message?
	}

	//TODO: Need to confirm API token is value before saving

	// delete newUser.passwordConfirm;
	// User.create(newUser, function(err, returnedUser) {
	// 	if (err) return next(err);
	// 	req.logIn(returnedUser, function (err) {
	// 		if (err) return next(err);
	// 		// We respond with a reponse object that has user with _id and email.
	// 		res.status(200).send({ user: _.omit(returnedUser.toJSON(), ['password', 'salt']) });
	// 	});

	// });
});
