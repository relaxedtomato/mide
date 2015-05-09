// 'use strict';
var router = require('express').Router();
module.exports = router;

//sign up
router.post('/signup', function(req, res, next) {
	var newUser = req.body;

	// if (newUser.password !== newUser.passwordConfirm) {
	// 	var error = new Error('Passwords do not match');
	// 	error.status = 401;
	// 	return next(error);
	// }


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
