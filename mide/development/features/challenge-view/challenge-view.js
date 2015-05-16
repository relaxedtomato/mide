app.config(function($stateProvider){
	$stateProvider.state('challenge.view', {
		url: '/challenge/view',
		views: {
			'tab-view' : {
				templateUrl: 'features/challenge-view/challenge-view.html',
				controller: 'ChallengeViewCtrl'
			}
		}
	});
});

app.controller('ChallengeViewCtrl', function($scope, ChallengeFactory, $state, $ionicSlideBoxDelegate, $ionicModal){

	//Controls Slide
	$scope.slideHasChallenged = function(index){
		$ionicSlideBoxDelegate.slide(index);
	};

	//Challenge View
	$scope.challenge = ChallengeFactory.getProblem() || "Test";

	// $scope.$on('problemUpdated', function(e){
	// 	$scope.challenge = ChallengeFactory.getProblem();
	// });

	$ionicModal.fromTemplateUrl('my-modal.html', {
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.modal = modal;
	});
	$scope.openModal = function() {
	  $scope.modal.show();
	};
	$scope.closeModal = function() {
	  $scope.modal.hide();
	};
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
	  $scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	  // Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
	  // Execute action
	});
	
});