app.config(function($stateProvider){
	$stateProvider.state('challenge.code', {
		url : '/challenge/code',
		views: {
			'tab-code' : {
				templateUrl : 'features/challenge-code/challenge-code.html',
				controller : 'ChallengeCodeCtrl'
			}
		}
		// ,
		// onEnter : function(ChallengeFactory, $state){
		// 	if(ChallengeFactory.getProblem().length === 0){
		// 		$state.go('challenge.view');
		// 	}
		// }
	});
});

app.controller('ChallengeCodeCtrl', function($scope, $state, $rootScope, ChallengeFactory, ChallengeFooterFactory, $ionicModal, $ionicPopup){

	setTimeout(function (){
		$scope.keyboardVis = window.cordova.plugins.Keyboard.isVisible;
			console.log("cordova isvis", window.cordova.plugins.Keyboard.isVisible);
			console.log("$scope keyboardVis", $scope.keyboardVis);


		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		  window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  window.cordova.plugins.Keyboard.disableScroll(true);
		}
	}, 500);

	// $scope.footerHotkeys = ChallengeFooterFactory.getHotkeys();
	$scope.footerMenu = ChallengeFooterFactory.getFooterMenu();

	// console.log('footerMenu',$scope.footerMenu);

	//Challenge Submit
	$scope.text = ChallengeFactory.getSubmission() || 'text';

	//initialize CodeMirror
	var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
		lineNumbers : true,
		mode: 'javascript',
		autofocus : true,
		theme : 'twilight',
		lineWrapping: true
	});

	myCodeMirror.replaceSelection($scope.text);

	$scope.updateText = function(){
		$scope.text = myCodeMirror.getValue();
		//check if digest is in progress
		if(!$scope.$$phase) {
		  $scope.$apply();
		}
	};

	$scope.insertFunc = function(param){
		//given a param, will insert characters where cursor is
		console.log("inserting: ", param);
		myCodeMirror.replaceSelection(param);
		// window.cordova.plugins.Keyboard.show();
		myCodeMirror.focus();
	};

    myCodeMirror.on("change", function (myCodeMirror, changeObj){
    	$scope.updateText();
    });
    // myCodeMirror.on("cursorActivity", function (myCodeMirror, changeObj){
    // 	window.cordova.plugins.Keyboard.show();
    // 	$scope.keyboardVis = true;
    // 	$scope.$apply();
    // });
    window.addEventListener("native.keyboardshow", function (){
    	$scope.keyboardVis = true;
    	$scope.$apply();
    });
    window.addEventListener("native.keyboardhide", function (){
    	$scope.keyboardVis = false;
    	$scope.$apply();
    });

    // myCodeMirror.off("focus", function (myCodeMirror, changeObj){
    // 	$scope.keyboardVis = $window.cordova.plugins.Keyboard.isVisible;
    // });

	$scope.buttons = {
		compile : 'Compile',
		dismiss : 'Dismiss'
	};

	// $rootScope.$on('problemUpdated', function(e){
	// 	$scope.projectId = ChallengeFactory.getProblem().session.projectId;
	// 	$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;
	// 	$scope.text = ChallengeFactory.getProblem().session.setup;
	// });
	// $scope.popUp = function(){
	// 	// $scope.compileChallenge = function(text){
	// 		// ChallengeFactory.setSubmission('hello world');
	// 		// $state.go('challenge.compile');
	// 	// };

	// };
	

	// $scope.dismissChallenge = function(){
	// 	var id = 'A9QKk6SmRpDcriU-HMQr';
	// 	ChallengeFactory.getChallenge(id).then(function(data){
	// 		$state.go('challenge.view');
	// 	});
	// };
	$scope.keys = [];
	$scope.showPopup = function(item) {
		console.log('keys',item);
		$scope.data = {};
		$scope.keys = item;
		

		  // An elaborate, custom popup
		var myPopup = $ionicPopup.show({
		templateUrl: 'features/challenge-code/challenge-syntax.html',
		title: 'Select Something',
		subTitle: 'Please use normal things',
		scope: $scope,
		buttons: [
			  { text: 'Cancel' },
			  {
			    text: '<b>Save</b>',
			    type: 'button-positive',
			    onTap: function(e) {
			      if (!$scope.data.wifi) {
			        //don't allow the user to close unless he enters wifi password
			        e.preventDefault();
			      } else {
			        return $scope.data.wifi;
			      }
			    }
			  }
			]
		});
	};

	//modal testing
	// $ionicModal.fromTemplateUrl('challenge-code-modal.html', {
	//   scope: $scope,
	//   animation: 'slide-in-up'
	// }).then(function(modal) {
	// 	console.log("into the then");
	//   $scope.modal = modal;
	// });
	// $scope.openModal = function() {
	//   $scope.modal.show();
	// };
	// $scope.closeModal = function() {
	//   $scope.modal.hide();
	// };
	// //Cleanup the modal when we're done with it!
	// $scope.$on('$destroy', function() {
	//   $scope.modal.remove();
	// });
	// // Execute action on hide modal
	// $scope.$on('modal.hidden', function() {
	//   // Execute action
	// });
	// // Execute action on remove modal
	// $scope.$on('modal.removed', function() {
	//   // Execute action
	// });

});