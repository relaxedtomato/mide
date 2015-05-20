// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
var path = require('path');
var bluebird = require('bluebird');
var githubInstance = require('../../api/github');

router.get('/gistsQueue',getuser(),function(req,res,next){
    var user = req.user;
    var gistPromiseArr = [];

    user.gistsQueue.forEach(function(gistId){ //{id:gistId}
        //TODO: Not sure if this matches the npm library
        gistPromiseArr.push(getGistAsync({id:gistId}));
    });

    bluebird.all(gistPromiseArr).then(sendGists);

    function sendGists(response){
        res.send({
            gists:response
        });
    }

    //TODO: Test if this actually works
    function getGistAsync(obj){
        return new bluebird(function(resolve,reject){
            githubInstance.gists.get(obj,function(err,data){
                if(err) reject(err);
                else {
                    return resolve(data);
                }
            });
        });
    }
});
//TODO: You are here, deciding next steps, going into Angular or not
//TODO: TEST /createdGists and /gistsQueue Works
//TODO: getUser() is req here.
//TODO: Users can access all their gists, you may want to include and/or save the gist description as well
//TODO: gist file name, description, and code
//TODO: Abstract routes to separate folder labelled gists
//TODO: add back getUser for testing and post
router.get('/shareGists',getUser,function(req,res,next){
    var user = req.user;
    //TODO: This is not proper async and only temp for testing since getUser is not available
    UserModel.findOne({_id:gist.USER_ID1}).exec().then(function(data){
        user = data;
    });

    //TODO: store data from the front end
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

    //TODO: You need to track total calls per hour to avoid rate limiting, or per user

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
    });
});

router.get('/createdGists',getUser,function(req,res,next){
    var user = req.user;
    var gistPromiseArr = [];
    //var user;
    //TODO: This is not proper async and only temp for testing since getUser is not available
    //UserModel.findOne({_id:gist.USER_ID1}).exec().then(function(data){
    //user = data;
    user.gists.forEach(function(gistId){ //{id:gistId}
        gistPromiseArr.push(getGistAsync({id:gistId})); //TODO: Not sure if this matches the npm library
    });

    bluebird.all(gistPromiseArr).then(sendGists);

    function sendGists(response){
        res.send({
            gists:response
        });
    }
    //});

    //define Async function on github/index.js for modular use
    //TODO: Test if this actually works
    function getGistAsync(obj){
        return new bluebird(function(resolve,reject){
            githubInstance.gists.get(obj,function(err,data){
                if(err) reject(err);
                else {
                    return resolve(data);
                }
            });
        });
    }

    //TODO: Filter data using lo-dash before sending to the front end, sending all for now
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