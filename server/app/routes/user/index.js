// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
var path = require('path');
var SESSION_SECRET = require(path.join(__dirname, '../../../env')).SESSION_SECRET;
var q = require('q');
var jwt = require('jsonwebtoken'); //encoded json object (token), token sends it back on each request
//var request = require('request');
//var bluebird = require('bluebird');
//var request = bluebird.promisifyAll(require('request'));
//var githubInstance = require('../../api/github');
//var codewars = require('../../api/codewars');
//var githubInstance = require('github');
// 'use strict';
var bluebird = require('bluebird');
var githubInstance = require('../../api/github');

//TODO: Temp for testing
//var gist = require('../../../env/gist.js')

module.exports = router;

function getUser(req,res,next){
    //console.log('req.user id',req.user); //req.user is user ID, so convert to the full user before moving forward
    UserModel.findOne({_id:req.user.userId}).exec().then(userFound);

    function userFound(user){
        req.user = user; //place the full user data on req.user to pass on for use
        next();
    }

}

function authenticate(req,res,next){
    var body = req.body;
    if (!body.username || !body.password) {
        res.sendStatus(400) //.end('Must provide username and/or password');
    }
    //TODO: Check if data.username is username or email
    UserModel.findOne({userName:body.username}).exec().then(userFound,userNotFound);

    function userFound(user){
        console.log('userFound',user);
        //console.log('correctPassword check',user.correctPassword(body.password));
        if(user.correctPassword(body.password)){
            console.log('in here');
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
    console.log('/login post found');
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
        foundFriend = _.pick(foundFriend,'userName');
        res.send({
            friend:foundFriend
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

router.get('/getFriends',getUser,function(req,res,next){
    //console.log('in here');
    q.all(UserModel.getFriends(req.user)).then(friendsFound,friendsNotFound);

    function friendsFound(friends){
        //console.log('friends',friends); //TODO: return an array object of friend names for now
        //TODO: Use low-dash to mit
        friends.forEach(function(friend,index){
           friends[index] = _.pick(friend,'userName','_id'); //TODO: Assume this works
        });
        res.send({
            friends:friends
        });
    }

    function friendsNotFound(err){
        console.log(err);
    }
});

//router.get('/gistsQueue',getUser,function(req,res,next){
//    var user = req.user;
//    var gistPromiseArr = [];
//
//    user.gistsQueue.forEach(function(gistId){ //{id:gistId}
//        //TODO: Not sure if this matches the npm library
//        gistPromiseArr.push(getGistAsync({id:gistId}));
//    });
//
//    bluebird.all(gistPromiseArr).then(sendGists);
//
//    function sendGists(response){
//        res.send({
//            gists:response
//        });
//    }
//
//    //TODO: Test if this actually works
//    function getGistAsync(obj){
//        return new bluebird(function(resolve,reject){
//            githubInstance.gists.get(obj,function(err,data){
//                if(err) reject(err);
//                else {
//                    return resolve(data);
//                }
//            });
//        });
//    }
//});
////TODO: Users can access all their gists, you may want to include and/or save the gist description as well
////TODO: gist file name, description, and code
////TODO: Add gists ID/TOKEN to Production ENV variables (currently in .gitignore)
//router.post('/shareGists',getUser,function(req,res,next){
//    var user = req.user;
//
//    //TODO: This is not proper async and only temp for testing since getUser is not available
//    //UserModel.findOne({_id:gist.USER_ID1}).exec().then(function(data){
//    //    user = data;
//    //});
//
//    //TODO: store data from the front end
//    //TODO: replace below with req.body.varName
//    var friends = gist.USER_ID2; //TODO: Save User ID on front-end as well req.body.friend.id ||
//    var code = gist.TEST_TEXT; //TODO: Front end must send code snippet req.body.gist.code ||
//    var description = gist.TEST_DESC; //TODO: req.body.gist.description ||
//    var fileName = gist.TEST_FILE; //TODO: Why is fileName underlined, req.body.gist.fileName ||
//
//    //Note: You can do multiple files as once as well.
//    var input = {
//        "description": description,
//        "public": true,
//        "files": {
//            fileName: {
//                "content": code
//            }
//        }
//    };
//
//    //TODO: You need to track total calls per hour to avoid rate limiting, or per user
//    //TODO: Below can be converted to an Async gist call
//    githubInstance.gists.create(input,function(err,response){
//        //TODO: send over user ID on get and add friends as well
//
//        user.gists.push(response.id); //gist id to save
//        user.saveAsync()
//            .then(findFriends)
//            .then(addToFriendsQueue)
//            .then(sendResponse);
//
//        //TODO: General error handling for the app
//        //TODO: Test handling for multiple friends
//        function findFriends(){
//            //return UserModel.findOne({_id:friendId}).exec()
//            var friendsPromiseArr = [];
//            friends.forEach(function(friendId){
//                friendsPromiseArr.push(UserModel.findOne({id:friendId}).exec())
//            });
//            return bluebird.all(friendsPromiseArr);
//        }
//
//        function addToFriendsQueue(friends){
//            var friendsSavePromiseArr = [];
//            friends.forEach(function(friend){
//                friend.gistsQueue.push(response.id);
//                friendsSavePromiseArr.push(friend.saveAsync());
//            });
//
//            //friend.saveAsync();
//            return bluebird.all(friendsSavePromiseArr);
//        }
//
//        function sendResponse() {
//            res.status(200).end();  //added to User queue, response to existing user
//            //TODO: Should we store the code snippets on the backend as well? In the future
//        }
//    });
//});
//
//router.get('/createdGists',getUser,function(req,res,next){
//    var user = req.user;
//    var gistPromiseArr = [];
//
//    //TODO: This is not proper async and only temp for testing since getUser is not available
//
//    user.gists.forEach(function(gistId){ //{id:gistId}
//        gistPromiseArr.push(getGistAsync({id:gistId})); //TODO: Not sure if this matches the npm library
//    });
//
//    bluebird.all(gistPromiseArr).then(sendGists);
//
//    function sendGists(response){
//        res.send({
//            gists:response
//        });
//    }
//
//    //TODO: Test if this actually works
//    function getGistAsync(obj){
//        return new bluebird(function(resolve,reject){
//            githubInstance.gists.get(obj,function(err,data){
//                if(err) reject(err);
//                else {
//                    return resolve(data);
//                }
//            });
//        });
//    }
//
//    //TODO: Filter data using lo-dash before sending to the front end, sending all for now
//});