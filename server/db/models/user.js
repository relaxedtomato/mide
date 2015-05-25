// 'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var q = require('q');
var schemaOptions = {
    toJSON : {
        virtuals : true
    }
};

//TODO: Add required for userSchema after testing
var userSchema = new mongoose.Schema({
    userName : {type : String, required:true, unique:true},
    email: {
        type: String
    },
    apiKey: {type: String},
    password: {
        type: String,
        required:true
        //select : false //used in routes later to display or not display certain properties
    },
    salt: {
        type: String//,
        //select: false
    },
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    challengesCompleted: {type:Number},
    gists:[{type:String}],
    gistsQueue: [
                    {
                     user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                     gist:String
                    }
                ]
}, schemaOptions);

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

var USER_LEVEL = {
    admin : 2,
    superUser : 3
};

userSchema.virtual('admin').get(function() {
    return this.userType === USER_LEVEL.admin;
});

userSchema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

userSchema.plugin(findOrCreate);
userSchema.statics.generateSalt = generateSalt;
userSchema.statics.encryptPassword = encryptPassword;
userSchema.method('correctPassword', function (candidatePassword) {
    //console.log('candidatePassword',candidatePassword);
    console.log('correctPassword',(encryptPassword(candidatePassword, this.salt)) === this.password);
    return encryptPassword(candidatePassword, this.salt) === this.password;
});
userSchema.method('addFriend',function(friend){
    var user = this; //user addFriend method was called on
    //console.log(friend);
    //function friendFound(friend){
    //    console.log('friend Found', friend._id);
    //TODO: Cannot add yourself as a friend
    if(user.friends.indexOf(friend._id)===-1){ //check if friend exists or not
        user.friends.push(friend._id); //Only pushing the user ID to the current User for reference
    }

    return user.saveAsync(); //TODO: You need to do save async
    //return friend;
    //}

    //function friendNotFound(response){
        //res.status(401).end('Friend does not exist'); //TODO: Look-up friend list dynamically
        //console.log('friendNotFound');
    //}
});
//userSchema.method('getFriends',function(){
//    var user = this;
//    var friends = user.friends; //array of Friend Object IDs
//
//});
userSchema.statics.getFriends = function(user){
    //console.log('in here',friends);

    var User = this; //user model
    var friends = user.friends; //object ID array

    //array of promises
    var friendsPromiseArr = [];

    friends.forEach(function(friendId){
        if(friendId !== null) {
            //console.log(friendId);
            friendsPromiseArr.push(User.findOne({_id: friendId}).exec());
        }
    });

    //console.log('friendsPromiseArr',friendsPromiseArr);
    return friendsPromiseArr; //promise returning array of all friends

};
userSchema.methods.saveAsync = function () {
    return q.ninvoke(this,'save');
};

mongoose.model('User', userSchema);