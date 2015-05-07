//make api calls
var request = require('request');
var codewars = {};

var urls = {
    userData: function(user) {
        return 'https://www.codewars.com/api/v1/users/'+user;
    },
    nextChallenge: function(language, apiKey){
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
    api: "A9QKk6SmRpDcriU-HMQr",
    user:"cwcfsa@gmail.com",
    strategy:'kyu_8_workout',
    challenge: 'multiply', //http://www.codewars.com/kata/multiply TODO: does it refer to this: 50654ddff44f800200000004
    projectId: '554b883a6c5b771ab000008a', //TODO:are these auto-generated for each one?
    solutionId: '554bb0f8555a87bb04000045', //TODO:are these auto-generated for each one?
    solution: 'code=function multiply(a, b){  return a * b}',
    language: 'javascript'
};

//GET User Data
codewars.getUserData = function(username){
    username = username || test.user;
    request
        .get(urls.userData(username))
        .on('data', function(data){
            console.log(data.toString()); //TODO: Return the data
        });
};

//POST Train Next Code Challenge
codewars.postNextChallenge = function(strategy, language){
    var language = language || test.language;
    var strategy = strategy || test.strategy;

    var options = {
        url: urls.nextChallenge(language),
        form:{
            strategy:strategy
        },
        headers: {
            Authorization: test.api
        }
    };

    request//TODO: Return a promise instead
        .post(options)
        .on('data',function(data){
            console.log(data.toString());
        });
}

//POST Train (Specific) Code Challenge
codewars.postSpecificChallenge = function(language,challenge){
    var language = language || test.language;
    var challenge = challenge || test.challenge;

    var options = {
        url: urls.specificChallenge(language,challenge),
        headers: {
            Authorization: test.api //TODO: need specific API
        }
    };

    request
        .post(options)
        .on('data',function(data){
            console.log(data.toString());
        });
};

//TODO: Investigate issues with rx: {"success":false,"reason":"token expired"}%

//POST Attempt Solution
codewars.attemptSolution = function(projectId,solutionId, solution){
    projectId = projectId || test.projectId;
    solutionId = solutionId || test.solutionId;
    solution = solution || test.solution;

    var options = {
    url: urls.attemptSolution(projectId, solutionId),
    form:solution,
    headers: {
        Authorization: test.api
        }
    };

    request
        .post(options)
        .on('data',function(data){
            console.log(data.toString());
        });
}

//POST Finalize Solution
codewars.finalizeSolution = function(projectId,solutionId){
    projectId = projectId || test.projectId;
    solutionId = solutionId || test.solutionId;

    var options = {
        url: urls.finalizeSolution(projectId, solutionId),
        headers: {
            Authorization: test.api //TODO: this should be input data, if it is not available, use tests data
        }
    };

    request
        .post(options)
        .on('data',function(data){
            console.log(data.toString());
        });

}

codewars.finalizeSolution();

module.exports = codewars;

//1. test current functionality
//2. Promisify and test
//3. Ship
//4. Create Tests for codewars.api.js