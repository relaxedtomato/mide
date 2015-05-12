app.config(function($stateProvider){
	$stateProvider.state('challenge.code', {
		url : '/challenge/code',
		views: {
			'tab-code' : {
				templateUrl : 'features/challenge-code/challenge-code.html',
				controller : 'ChallengeCodeCtrl'
			}
		},
		onEnter : function(ChallengeFactory, $state){
			if(ChallengeFactory.getProblem().length === 0){
				$state.go('challenge.view');
			}
		}
	});
});

app.controller('ChallengeCodeCtrl', function($scope,$state, $rootScope, ChallengeFactory){

	//Challenge Submit
	//text needs to be worked on
	$scope.text = ChallengeFactory.getSubmission();

	var editor;

	$scope.projectId = ChallengeFactory.getProblem().session.projectId;
	$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;

	$scope.aceLoaded = function(_editor){
		editor = _editor;
		editor.getSession().setUseWorker(false);

		editor.focus();

		editor.setReadOnly(false);
	};

	$scope.aceChanged = function(e){
		// console.log(e);
	};

	$scope.clickEditor = function() {
		editor.focus(); //bring editor to focus

		// cordova.plugins.Keyboard.show = function() {
		//     exec(null, null, "Keyboard", "show", []);
		// };
		console.log("is Keyboard vis?", cordova.plugins.Keyboard.isVisible);
		// cordova.plugins.Keyboard.show();
		// native.keyboardshow();
		// console.log("is Keyboard vis?", cordova.plugins.Keyboard);

	};

	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

	$rootScope.$on('problemUpdated', function(e){
		$scope.projectId = ChallengeFactory.getProblem().session.projectId;
		$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;
		$scope.text = ChallengeFactory.getProblem().session.setup;
	});

	$rootScope.$on('submissionUpdated', function(e, submission){
		$scope.text = ChallengeFactory.getSubmission();
	});

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