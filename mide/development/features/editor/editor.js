app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor',
		views: {
			'tab-editor' : {
				templateUrl: 'features/editor/editor.html',
				controller: 'EditorCtrl'
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

app.controller('EditorCtrl', function($scope, EditorFactory, ChallengeFactory, challenge, $state){

	$scope.challenge = challenge;
	$scope.challengeDesc = JSON.parse(challenge[0].body).description;
	$scope.challengeBody = JSON.parse(challenge[0].body).session.setup;


	$scope.text = $scope.challengeBody;

	var editor;
    $scope.aceLoaded = function(_editor){
    	editor = _editor;
    	editor.focus();

    	var session = editor.getSession();
        //Get the number of lines
		var count = session.getLength();
		//Go to end of the last line
		editor.gotoLine(count, session.getLine(count-1).length);
		editor.setReadOnly(false);

		console.log("session,", session);
		console.log("count,", count);
        console.log("editor position: ", editor.getCursorPosition());
        console.log("navigate position: ", editor.navigateFileEnd());
    };

    $scope.aceChanged = function(e){
        // console.log(e);
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

});

app.factory('EditorFactory', function($http, ApiEndpoint){
	return {
		getChallenge : function(){
			// return $http.get(ApiEndpoint.url + '/challenge').then(function(response){
			// 	return response.data;
			// });
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