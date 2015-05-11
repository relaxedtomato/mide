app.config(function($stateProvider){
	$stateProvider.state('challenge.code', {
		url : '/challenge/code',
		views: {
			'tab-code' : {
				templateUrl : 'features/challenge-code/challenge-code.html',
				controller : 'ChallengeCodeCtrl'
			}
		}
	});
});

app.controller('ChallengeCodeCtrl', function($scope,$state, ChallengeFactory){

	//Challenge Submit
	//text needs to be worked on
	$scope.text = ChallengeFactory.getSubmission();

	$scope.projectId = ChallengeFactory.getProblem().session.projectId;
	$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;

	$scope.aceLoaded = function(_editor){
		_editor.setReadOnly(false);
	};

	$scope.aceChanged = function(e){
		// console.log(e);
	};

	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

	$scope.submitSubmission = function(projectId, solutionId, code){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		ChallengeFactory.submitSubmission(id, projectId, solutionId, code).then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.testSubmission = function(projectId, solutionId, code){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		ChallengeFactory.testSubmission(id, projectId, solutionId, code).then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.dismissChallenge = function(){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		ChallengeFactory.getChallenge(id).then(function(data){
			$state.go('challenge.view');
		});
	};

});