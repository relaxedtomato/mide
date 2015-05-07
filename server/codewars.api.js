//make api calls

var codewars = {}
var request = require('request');
//request.
//https://www.codewars.com/api/v1/users/:id_or_username
//you can do streaming with requests

var urls = {
    userData: function(user) {
        return 'https://www.codewars.com/api/v1/users/'+user;
    },
    nextChallenge: function(language, apiKey){
        console.log(language, apiKey);
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
    }
};

var test = {
    api: "A9QKk6SmRpDcriU-HMQr",
    user:"cwcfsa@gmail.com",
    challenge: 'multiply', //http://www.codewars.com/kata/multiply TODO: does it refer to this: 50654ddff44f800200000004
    projectId: '554b883a6c5b771ab000008a', //TODO:are these auto-generated for each one?
    solutionId: '554bb0f8555a87bb04000045', //TODO:are these auto-generated for each one?
    solution: 'code=function multiply(a, b){  return a * b}'
};
//?access_key=some-api-key
//

//https://www.codewars.com/api/v1/users/:id_or_username
//GET User Data
//request
//    .get(urls.userData(test.user))
//    .on('data', function(data){
//        console.log(data.toString());
//    });

//POST Train Next Code Challenge
//var options1 = {
//    url: urls.nextChallenge('javascript'),
//    data:{
//        strategy:'kyu_8_workout'
//    },
//    headers: {
//        Authorization: test.api
//    }
//};
//
//request
//    .post(options1)
//    .on('data',function(data){
//        console.log(data.toString());
//    });

//POST Train (Specific) Code Challenge
//var options2 = {
//    url: urls.specificChallenge('javascript',test.challenge),
//    headers: {
//        Authorization: test.api
//    }
//};
//
//request
//    .post(options2)
//    .on('data',function(data){
//        console.log(data.toString());
//    });

////TODO: Investigate issues with rx: {"success":false,"reason":"token expired"}%

//POST Attempt Solution
//var options3 = {
//    url: urls.attemptSolution(test.projectId, test.solutionId),
//    form:test.solution,
//    headers: {
//        Authorization: test.api
//    }
//};


//request
//    .post(options3)
//    .on('data',function(data){
//        console.log(data.toString());
//    });


//POST Finalize Solution
//var options4 = {
//    url: urls.finalizeSolution(test.projectId, test.solutionId),
//    headers: {
//        Authorization: test.api
//    }
//};
//
//request
//    .post(options4)
//    .on('data',function(data){
//        console.log(data.toString());
//    });



//https://www.codewars.com/api/v1/code-challenges/projects/554b883a6c5b771ab000008a/solutions/554bb0f8555a87bb04000045/attempt
//
//curl "https://www.codewars.com/api/v1/code-challenges/projects/554b883a6c5b771ab000008a/solutions/554bb0f8555a87bb04000045/attempt"  -X POST -d 'code=function multiply(a, b){ return a * b}' -H "Authorization: A9QKk6SmRpDcriU-HMQr"

module.exports = codewars;