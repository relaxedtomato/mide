// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
var path = require('path');
var SESSION_SECRET = require(path.join(__dirname, '../../../env')).SESSION_SECRET;

var jwt = require('jsonwebtoken'); //encoded json object (token), token sends it back on each request

module.exports = router;

function getUser(req,res,next){
    console.log('req.user id',req.user.userId); //req.user is user ID, so convert to the full user before moving forward
    UserModel.findOne({_id:req.user.userId}).exec().then(userFound);

    function userFound(user){
        //console.log('userFound',user,body.password,body.username);
        //console.log('correctPassword check',user.correctPassword(body.password));
        //if(user.correctPassword(body.password)){
        req.user = user; //place the full user data on req.user to pass on for use
        next();
        //} else {
        //    res.status(401).end('Username or password incorrect');
        //userNotFound(user);
        //}
    }

    //function userNotFound(response){
    //    res.status(401).end('Username or password incorrect');
    //}
}

function authenticate(req,res,next){
    var body = req.body;
    if (!body.username || !body.password) {
        res.sendStatus(400)//.end('Must provide username and/or password');
    }
    //TODO: Check if data.username is username or email
    UserModel.findOne({userName:body.username}).exec().then(userFound,userNotFound);

    function userFound(user){
        console.log('userFound',user,body.password,body.username);
        console.log('correctPassword check',user.correctPassword(body.password));
        if(user.correctPassword(body.password)){
            req.user = user;
            next();
        } else {
          //res.status(401).end('Username or password incorrect');
          userNotFound(user);
        }
    }

    function userNotFound(response){
        res.status(401).end('Username or password incorrect');
    }
}

//TODO: figure out what to include
router.post('/login', authenticate, function(req,res){ // api/login
    var token = jwt.sign({
        userId: req.user._id
    },SESSION_SECRET);
    res.send({
        token:token,
        username: req.user.userName
    });
});

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
		res.sendStatus(401);//.send('User was not created');
	}
});

router.post('/addFriend', getUser, function(req,res,next){
    //console.log('/addFriend Route data','req.user',req.user,'req.body.friend',req.body.friend); //attached by getUser
    var user = req.user;
    var foundFriend;

    //TODO: You cannot add yourself as a friend
    UserModel
        .findOne({userName:req.body.friend}).exec()
        .then(friendFound,friendNotFound)
        .then(friendAdded);

    function friendAdded(){
        //res.status(401).end('Username or password incorrect');
        //send the friend back
        console.log('friendAdded',foundFriend.userName);
        res.send({
            data:foundFriend.userName
        });
    }

    //TODO: Friend data is being sent back after being added to database

    function friendFound(friend){
        //return user.addFriend(friend).then(function(){
        //    return friend;
        //});
        //console.log('friendFound',friend);
        foundFriend = friend;
        return user.addFriend(friend);
    }

    function friendNotFound(response){
        res.status(401).end('Username or password incorrect');
    }

});

