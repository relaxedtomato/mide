app.config(function($stateProvider){
	$stateProvider.state('challenge', {
		templateUrl : 'features/challenge/challenge.html',
		abstract : true
	});
});

app.factory('ChallengeFactory', function($http, ApiEndpoint, $rootScope){

	var problem = '';
	var submission ='';
	var test = '';

	return {
		getChallenge : function(id){
			return $http.get(ApiEndpoint.url + '/challenge/' + id).then(function(response){
				problem = response.data;
				submission = problem.session.setup || '';
				$rootScope.$broadcast('problemUpdated');
				return response.data;
			});
		},
		submitSubmission : function(id, projectId, solutionId, code){
			submission = code;
			$rootScope.$broadcast('submissionUpdated');
			var submit = {
				code : code,
				projectId : projectId,
				solutionId : solutionId
			};
			return $http.post(ApiEndpoint.url + '/challenge/submit/' + id, submit).then(function(response){
				return response.data;
			});
		},
		testSubmission : function(id, projectId, solutionId, code){
			submission = code;
			$rootScope.$broadcast('submissionUpdated');
			var submit = {
				code : code,
				projectId : projectId,
				solutionId : solutionId
			};
			return $http.post(ApiEndpoint.url + '/challenge/attempt/' + id, submit).then(function(response){
				test = response.data;
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