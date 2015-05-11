//make api calls
//TODO: Investigate issues with rx: {"success":false,"reason":"token expired"}%
//When token expired response is received, you need to reset the user account manually

var bluebird = require('bluebird');
var request = bluebird.promisifyAll(require('request'));
var codewars = {};

var urls = {
    userData: function(user) {
        return 'https://www.codewars.com/api/v1/users/'+user;
    },
    nextChallenge: function(language){
        return 'https://www.codewars.com/api/v1/code-challenges/'+language+'/train';
    },
    specificChallenge: function(language, challenge){
        return 'https://www.codewars.com/api/v1/code-challenges/'+challenge+'/'+language+'/train';
    },
    attemptSolution: function(projectId, solutionId){
        return 'https://www.codewars.com/api/v1/code-challenges/projects/'+projectId+'/solutions/'+solutionId+'/attempt';
    },
    finalizeSolution: function(projectId, solutionId){
        return 'https://www.codewars.com/api/v1/code-challenges/projects/'+projectId+'/solutions/'+solutionId+'/finalize';
    }//TODO: Defferred Resolution API Call left out
};

var test = {
    apiKey: "A9QKk6SmRpDcriU-HMQr",
    user:"cwcfsa@gmail.com",
    strategy:'default',
    challenge: 'multiply', //http://www.codewars.com/kata/multiply TODO: does it refer to this: 50654ddff44f800200000004
    projectId: '554b883a6c5b771ab000008a', //TODO:are these auto-generated for each one?
    solutionId: '554bb0f8555a87bb04000045', //TODO:are these auto-generated for each one?
    solution: 'code=function multiply(a, b){  return a * b}',
    language: 'javascript'
};

//GET User Data
codewars.getUserData = function(username){
    username = username || test.user;
    return request.getAsync(urls.userData(username)).spread(function(res, body){
        return JSON.parse(body);
    }).catch(function(err){
        throw new Error(err);
    });
};

//POST Train Next Code Challenge
codewars.postNextChallenge = function(apiKey, strategy, language){
    language = language || test.language;
    strategy = strategy || test.strategy;
    apiKey = apiKey || test.apiKey;

    var options = {
        url: urls.nextChallenge(language),
        form:{
            strategy:strategy
        },
        headers: {
            Authorization: apiKey
        }
    };

    return request.postAsync(options).spread(function(res, body){
        return JSON.parse(body);
    }).catch(function(err){
        throw new Error(err);
    });
};

//POST Train (Specific) Code Challenge
codewars.postSpecificChallenge = function(apiKey,challenge,language){
    language = language || test.language;
    challenge = challenge || test.challenge;
    apiKey = apiKey || test.apiKey;

    var options = {
        url: urls.specificChallenge(language,challenge),
        headers: {
            Authorization: apiKey
        }
    };

    return request.postAsync(options).spread(function(res, body){
        return JSON.parse(body);
    }).catch(function(err){
        throw new Error(err);
    });
};

//POST Attempt Solution
//{
//	"success":true,
//	"dmid":"4rsdaDf8d"
//}
codewars.attemptSolution = function(apiKey,projectId,solutionId, solution){
    projectId = projectId || test.projectId;
    solutionId = solutionId || test.solutionId;
    solution = solution || test.solution;
    apiKey = apiKey || test.apiKey;

    var options = {
    url: urls.attemptSolution(projectId, solutionId),
    form:solution,
    headers: {
        Authorization: apiKey
        }
    };

    return request.postAsync(options).spread(function(res, body){
        console.log(res);
        console.log(body);
        return JSON.parse(body);
    }).catch(function(err){
        throw new Error(err);
    });
};

//POST Finalize Solution
//{
//	"success":true,
//}
codewars.finalizeSolution = function(apiKey,projectId,solutionId){
    projectId = projectId || test.projectId;
    solutionId = solutionId || test.solutionId;
    apiKey = apiKey || test.apiKey;

    var options = {
        url: urls.finalizeSolution(projectId, solutionId),
        headers: {
            Authorization: apiKey
        }
    };

    return request.postAsync(options).spread(function(res, body){
        console.log(res);
        console.log(body);
        return JSON.parse(body);
    }).catch(function(err){
        throw new Error(err);
    });
};

//TODO: Grab Code Challenge ID based on slug

//Testing Promises (informal)
//var promise = codewars.postNextChallenge();
//promise.then(function(data){
//    console.log(data.toString());
//});

module.exports = codewars;

//4. TODO: Create Tests for codewars.api.js
//TODO: include console logging using chalk or other npm lib