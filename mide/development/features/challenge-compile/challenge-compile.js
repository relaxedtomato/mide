app.config(function($stateProvider){
	$stateProvider.state('challenge.compile', {
		url : '/challenge/compile',
		views : {
			'tab-compile' : {
				templateUrl : 'features/challenge-compile/challenge-compile.html',
				controller: 'ChallengeCompileCtrl'
			}
		},
		onEnter : function(ChallengeFactory, $state){
			if(ChallengeFactory.getSubmission().length === 0){
				$state.go('challenge.view');
			}
		}
	});
});

app.controller('ChallengeCompileCtrl', function($scope, ChallengeFactory){
	var code = ChallengeFactory.getSubmission();
	var api = {
		console : console
	};
	var plugin = new jailed.DynamicPlugin(code, api);
	$scope.results = ChallengeFactory.getSubmission();

	$scope.$on('submissionUpdated', function(e){
		$scope.results = ChallengeFactory.getSubmission();

	});
	console.dir(jailed);
});