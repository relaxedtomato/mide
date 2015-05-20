// 'use strict';
var router = require('express').Router();
var UserModel = require('mongoose').model('User');
var _ = require('lodash');
var path = require('path');
var bluebird = require('bluebird');
var githubInstance = require('../../api/github');

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

router.get('/gistsQueue',getUser,function(req,res,next){
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
//TODO: Users can access all their gists, you may want to include and/or save the gist description as well
//TODO: gist file name, description, and code
//TODO: Add gists ID/TOKEN to Production ENV variables (currently in .gitignore)
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
        //TODO: send over user ID on get and add friends as well

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

    //TODO: This is not proper async and only temp for testing since getUser is not available

    user.gists.forEach(function(gistId){ //{id:gistId}
        gistPromiseArr.push(getGistAsync({id:gistId})); //TODO: Not sure if this matches the npm library
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

    //TODO: Filter data using lo-dash before sending to the front end, sending all for now
});