app.config(function($stateProvider){
	$stateProvider.state('tab.challenge', {
		url: '/challenge',
		views: {
			'tab-challenge' : {
				templateUrl: 'features/challenge/challenge.html',
				controller: 'ChallengeCtrl'
			}
		},
		resolve : {
			challenge : function(ChallengeFactory, $state){
				return ChallengeFactory.getChallenge().catch(function(err){
					$state.go('tab.account');
				});
			}
		}
	});
});

app.controller('ChallengeCtrl', function($scope, ChallengeFactory, challenge, $state){
	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

	$scope.challenge = challenge;

	$scope.submitChallenge = function(){
		$state.go('tab.challenge-submit');
		ChallengeFactory.submitChallenge().then(function(response){

			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.testChallenge = function(){
		ChallengeFactory.testChallenge().then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

});

app.factory('ChallengeFactory', function($http, ApiEndpoint){
	return {
		getChallenge : function(){
			return $http.get(ApiEndpoint.url + '/challenge').then(function(response){
				return response.data;
			});
		},
		submitChallenge : function(){
			return $http.post(ApiEndpoint.url + '/challenge/submit').then(function(response){
				return response.data;
			});
		},
		testChallenge : function(){
			return $http.post(ApiEndpoint.url + '/challenge/test/').then(function(response){
				return response.data;
			});
		}
	};
});