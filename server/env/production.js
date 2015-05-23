module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "CODEWARS": {
        "consumerKey": process.env.CODEWARS_CONSUMER_KEY,
        "consumerSecret": process.env.CODEWARS_CONSUMER_SECRET,
        "callbackUrl": process.env.CODEWARS_CALLBACK
    }
    "GISTS_CLIENT": process.env.GIST_CLIENT,
    "GISTS_SECRET": process.env.GIST_SECRET
};