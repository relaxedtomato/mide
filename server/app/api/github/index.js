var github=require('github');
var githubInstance = new github({version: "3.0.0"});
var gist = require('../../../env/gist.js')
//githubInstance = bluebird.promisifiy

//TODO: You need to track total calls per hour to avoid rate limiting, or per user
githubInstance.authenticate({ //TODO: Shift to library instead of here, to only complete once on server load
    type: "oauth",
    key: gist.CLIENT,
    secret: gist.CLIENT_SECRET
});

module.exports = githubInstance;