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

	var editor;

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

	$scope.submitChallenge = function(text){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		console.log(text);
		ChallengeFactory.submitChallenge(id, text).then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.testChallenge = function(text){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		console.log(text);
		ChallengeFactory.testChallenge(id, text).then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

});