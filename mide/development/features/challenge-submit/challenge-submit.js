app.config(function($stateProvider){
	$stateProvider.state('tab.challenge-submit', {
		url : '/challenge/submit',
		views: {
			'tab-challenge' : {
				templateUrl : 'features/challenge-submit/challenge-submit.html',
				controller : 'ChallengeSubmitCtrl'
			}
		}
	});
});

app.controller('ChallengeSubmitCtrl', function($scope){
	$scope.aceConfig = {
		useWrapMode : true,
		showGutter : true,
		theme: 'monokai',
		mode: 'javascript',
		onLoad: $scope.aceLoaded,
		onChange : $scope.aceChanged
	};
	//text needs to be worked on
	$scope.text = '';

	$scope.aceLoaded = function(_editor){
		console.log(_editor);
	};

	$scope.aceChanged = function(e){
		console.log(e);
	};

	console.log('this is loaded');
});