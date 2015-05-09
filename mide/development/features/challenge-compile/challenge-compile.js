app.config(function($stateProvider){
	$stateProvider.state('tab.challenge-compile', {
		url : '/tab/challenge-compile',
		views : {
			'tab-challenge' : {
				templateUrl : 'features/challenge-compile/challenge-compile.html',
				controller: 'ChallengeCompileCtrl'
			}
		}
	});
});

app.controller('ChallengeCompileCtrl', function($scope, $state){
	console.log('i am here');
	$scope.onSwipeLeft = function(){
		$state.go('tab.challenge-submit');
	};
});