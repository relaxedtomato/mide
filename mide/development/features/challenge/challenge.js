app.config(function($stateProvider){
	$stateProvider.state('challenge', {
		templateUrl : 'features/challenge/challenge.html',
		abstract : true
	});
});

app.factory('ChallengeFactory', function($http, ApiEndpoint){

	var submission ='';

	return {
		getChallenge : function(id){
			return $http.get(ApiEndpoint.url + '/challenge/' + id).then(function(response){
				submission = '' || response.data.session.setup;
				return response.data;
			});
		},
		submitChallenge : function(id, text){
			submission = text;
			var code = {
				code : text
			};
			console.log(code);
			return $http.post(ApiEndpoint.url + '/challenge/submit/' + id, code).then(function(response){
				return response.data;
			});
		},
		testChallenge : function(id, text){
			submission = text;
			var code = {
				code : text
			};
			console.log(code);
			return $http.post(ApiEndpoint.url + '/challenge/attempt/' + id, code).then(function(response){
				return response.data;
			});
		},
		getSubmission : function(){
			return submission;
		}
	};
});