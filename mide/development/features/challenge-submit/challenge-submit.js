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

app.controller('ChallengeSubmitCtrl', function($scope,$state, ChallengeFactory){

	//text needs to be worked on
	$scope.text = '';

	$scope.aceLoaded = function(_editor){
		console.log('this is now loaded');
		console.log(_editor);
		_editor.setReadOnly(false);
		_editor.focus();
	};

	$scope.aceChanged = function(e){

		console.log(e);
	};

	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

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

	$scope.onSwipeLeft = function(){
		$state.go('tab.challenge');
	};

	$scope.onSwipeRight = function(){
		$state.go('tab.challenge-compile');
	};
});