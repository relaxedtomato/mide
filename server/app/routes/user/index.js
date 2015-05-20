// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
var path = require('path');
var SESSION_SECRET = require(path.join(__dirname, '../../../env')).SESSION_SECRET;
var q = require('q');
var jwt = require('jsonwebtoken'); //encoded json object (token), token sends it back on each request
var request = require('request');
var bluebird = require('bluebird');
var request = bluebird.promisifyAll(require('request'));
var githubInstance = require('../../api/github');
//var codewars = require('../../api/codewars');
//var githubInstance = require('github');

//TODO: Temp for testing
var gist = require('../../../env/gist.js')

module.exports = router;

function getUser(req,res,next){
    //console.log('req.user id',req.user.userId); //req.user is user ID, so convert to the full user before moving forward
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
    //console.log(req.user);
    q.all(UserModel.getFriends(req.user)).then(friendsFound,friendsNotFound);

    function friendsFound(friends){
        //console.log('friends',friends); //TODO: return an array object of friend names for now
        //TODO: Use low-dash to mit
        friends.forEach(function(friend,index){
           friends[index] = _.pick(friend,'userName');
        });
        res.send({
            friends:friends
        });
    }

    function friendsNotFound(err){
        console.log(err);
    }
});


//TODO: Users can access all their gists, you may want to include and/or save the gist description as well
//TODO: gist file name, description, and code

//TODO: Abstract routes to separate folder labelled gists
//TODO: add back getUser for testing and post
router.get('/shareCode',function(req,res,next){
   //console.log('in here');
   //req.body.code = req.body.code || 'text'; //front-end is not connected yet

   //postGist(req.body.code).then(gistCreated);
   //var response = postGist("test");
   //console.log(response);
    var user;
    //TODO: This is not proper async and only temp for testing since getUser is not available
    UserModel.findOne({_id:gist.USER_ID1}).exec().then(function(data){
        user = data;
    });
    //gist.USER_ID1; //TODO: req.user ||
    var friendId = gist.USER_ID2; //TODO: Save User ID on front-end as well req.body.friend.id ||
    var code = gist.TEST_TEXT; //TODO: Front end must send code snippet req.body.gist.code ||
    var description = gist.TEST_DESC; //TODO: req.body.gist.description ||
    var fileName = gist.TEST_FILE; //TODO: Why is fileName underlined, req.body.gist.fileName ||

    //Note: You can do multiple files as once as well.
    var input = {
        "description": description,
        "public": true,
        "files": {
            fileName: {
                "content": code
            }
        }
    };
    //var options = {
    //    input:input,
    //    headers:{
    //        'User-Agent': {
    //            key: gist.CLIENT,
    //            secret: gist.CLIENT_SECRET
    //        }
    //    }
    //};
    //return request.postAsync(options);
    //request.postAsync('https://api.github.com/gists/',options).then(function(complete){
    //    console.log(complete);
    //});
    //TODO: You need to track total calls per hour to avoid rate limiting, or per user
    //var githubInstance = new github({version: "3.0.0"});
    //githubInstance.authenticate({ //TODO: Shift to library instead of here, to only complete once on server load
    //    type: "oauth",
    //    key: gist.CLIENT,
    //    secret: gist.CLIENT_SECRET
    //});

    githubInstance.gists.create(input,function(err,response){
        //console.log(response.id);
        //return response;
        //TODO: send over user ID on get and add friends as well
        // get code
        // post to github as .js file
        //store ID in database of user, as an array of code snippets to load
        user.gists.push(response.id); //gist id to save
        user.saveAsync()
            .then(findFriend)
            .then(addToFriendQueue)
            .then(sendResponse);

        //TODO: General error handling for the app
        function findFriend(){
            return UserModel.findOne({_id:friendId}).exec()
        }

        function addToFriendQueue(friend){
            friend.gistsQueue.push(response.id);
            return friend.saveAsync();
        }

        function sendResponse(){
            res.status(200).end();  //added to User queue, response to existing user
        }

        //TODO: Should we store this on the backend as well? In the future
        //store in queue for user sharing with
        //pop from queue afterwards shared code snippets (so no new notifications)
        //user should have a get request to check for notification
        //respond to user when the code snippet is actually sent

        //function postGist(code){ //code
        //}
    });
});

//you are missing retrieval of the actual gists
//TODO: getuser() is required here.
router.get('/gistsQueue',function(req,res,next){
    //gistsArr = req.users.gistsQueue;
    //empty gistsQueue TODO: Set status of them as sent, instead of removing
    //req.users.gistsQueue = [];
    //TODO: Test this
    //UserModel.findOne({_id:gist.USER_ID1}).exec().then(function(data) {
    //    //user = data;
    //}
    //
    //req.saveAsync().then(function(){
    //    res.send({
    //        gists:req.user.gistsQueue
    //    });
    //});
});

//TODO: You are here, deciding next steps, going into Angular or not
//TODO: TEST /createdGists and /gistsQueue Works
//TODO: getUser() is req here.
router.get('/createdGists',function(req,res,next){
    //var user = req.user;
    var gistPromiseArr = [];
    var gistResponses = [];
    var user;
    //TODO: This is not proper async and only temp for testing since getUser is not available
    UserModel.findOne({_id:gist.USER_ID1}).exec().then(function(data){
        user = data;

        //var gists = user.gists;

        //TODO: create promise arr to retrieve all gists
        user.gists.forEach(function(gistId){
            //githubInstance.get({id:gistId})
            //console.log(gistId);
            gistPromiseArr.push(getGistAsync({id:gistId})); //TODO: Not sure if this matches the npm library
            //githubInstance.gists.get({id:gistId},function(err,data){
                //if(err!==null) return reject(err);
                //resolve(data);
                //gistResponses.push(data);
                //console.log(data);
                //return data;
                //return;
            //});
        });
        //console.log(gistPromiseArr.length);
        //return; //end function
        //console.log(gistResponses);
        //while(gistResponses.length!==user.gists.length){
        //    //wait
        //}
        //sendGists(gistResponses);
        //console.log(gistPromiseArr.length);
        return;
    });

    //define Async function on github/index.js for modular use
    //TODO: Test if this actually works
    function getGistAsync(obj){
        return new bluebird(function(resolve,reject){
            //console.dir(githubInstance);
            githubInstance.gists.get(obj,function(err,data){
                if(err) reject(err);
                else {
                    //gistResponses.push(data);
                    return resolve(data);
                }
                //return data;
            });
        });
    }

    bluebird.all(gistPromiseArr).then(sendGists);

    //TODO: Filter data using lo-dash before sending to the front end, sending all for now
    function sendGists(response){
        //console.log(response,gistResponses);
        res.send({
            gists:response
        });
    }
});

//getStuff("dataParam",function(err,data){
//    To:
//
//        function getStuffAsync(param){
//            return new Promise(function(resolve,reject){
//                getStuff(param,function(err,data){
//                    if(err !== null) return reject(err);
//                    resolve(data);
//                });
//            });
//        }