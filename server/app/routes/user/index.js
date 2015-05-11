// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
var path = require('path');
var SESSION_SECRET = require(path.join(__dirname, '../../../env')).SESSION_SECRET;
var jwt = require('jsonwebtoken'); //encoded json object (token), token sends it back on each request

module.exports = router;

//TODO: bring in mongoose after testing
var user = {
    username: 'test',
    password: '1234'
};

function authenticate(req,res,next){
    var body = req.body;
    if (!body.username || !body.password) {
        res.status(400).end('Must provide username and/or password');
    }
    if (body.username !== user.username || body.password !== user.password) {
    //TODO: mongoose
        res.status(401).end('Username or password incorrect');
    }
    next(); //TODO: pass along via mongoose
}

//TODO: figure out what to include
router.post('/login', authenticate, function(req,res){ // api/login
    //TODO: for login, encrypt the mongoose database instead and return with username
    var token = jwt.sign({
        username: user.username //TODO: Mongoose _id
    },SESSION_SECRET);
    //res.send(user); //where is user defined?!
    //TODO: Store token in Mongoose for future reference
    res.send({
        token:token,
        username: user.username
        //TODO: user is from Mongoose, not local variable, maybe remove user from sending it (password)
    });
});


//TODO: Based on receiving a user via jwt
router.get('/token', function(req,res){
   console.log('api/user/token',req.user);
    //res.send()
    if(req.user){ //TODO: Can't req.user be faked? or is this decoded info?
        res.send({
            user:req.user //TODO: this is from Mongo Database
        });
    } else {
        res.status(401).send('No Authenticated user.');
    }
});

// We provide a simple GET /session in order to get session information directly.
// This is used by the browser application (Angular) to determine if a user is
//// logged in already.
//app.get('/session', function (req, res) {
//    //     User.findById(req.user._id)
//    //     .select('+password')
//    //     .select('+salt')
//    //     .exec()
//    //     .then(function (user) {
//
//    //     });
//    console.log('/session is being hit, cookie is',req.cookies, req.user);
//    if (req.user) {
//        res.send({ user: _.omit(req.user.toJSON(), ['salt', 'password']) });
//    } else {
//        res.status(401).send('No authenticated user.');
//    }
//});

router.post('/signup', function(req, res, next) { // api/signup


	UserModel.create(req.body).then(userCreated, userNotCreated);

	//TODO: Currently you can create multiple non-unique users
	function userCreated(userdata){
		//console.log('userCreated',userdata);
        var token = jwt.sign({
            userId : userdata._id
        },SESSION_SECRET);
        res.send({
            token:token,
            username: userdata.userName
        });
	}

	function userNotCreated(){
		res.send(401).end('User was not created');
	}
});

//res.sendStatus(200);
//res.send({user: _.omit(userdata.toJSON(),['email','salt','password','admin','_id', 'apiKey','__v']) });
