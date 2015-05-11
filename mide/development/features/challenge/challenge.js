app.config(function($stateProvider){
	$stateProvider.state('challenge', {
		templateUrl : 'features/challenge/challenge.html',
		abstract : true
	});
});

app.factory('ChallengeFactory', function($http, ApiEndpoint){

	var problem = '';
	var submission ='';

	return {
		getChallenge : function(id){
			return $http.get(ApiEndpoint.url + '/challenge/' + id).then(function(response){
				problem = response.data;
				submission = '' || problem.session.setup;
				return response.data;
			});
		},
		submitSubmission : function(id, projectId, solutionId, code){
			submission = code;
			var submit = {
				code : code,
				projectId : projectId,
				solutionId : solutionId
			};
			console.log(code);
			return $http.post(ApiEndpoint.url + '/challenge/submit/' + id, submit).then(function(response){
				return response.data;
			});
		},
		testSubmission : function(id, projectId, solutionId, code){
			submission = code;
			var submit = {
				code : code,
				projectId : projectId,
				solutionId : solutionId
			};
			console.log(code);
			return $http.post(ApiEndpoint.url + '/challenge/attempt/' + id, submit).then(function(response){
				return response.data;
			});
		},
		getSubmission : function(){
			return submission;
		},
		getProblem : function(){
			return problem;
		}
	};
});