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

app.controller('ChallengeViewCtrl', function($scope, ChallengeFactory, $state, $ionicSlideBoxDelegate){
	// //Controls Slide
	// $scope.slideHasChallenged = function(index){
	// 	$ionicSlideBoxDelegate.slide(index);
	// };

	// //Challenge View
	// $scope.challenge = ChallengeFactory.getProblem() || 'Wack';

	// $scope.$on('problemUpdated', function(e){
	// 	$scope.challenge = ChallengeFactory.getProblem();
	// });

	// $scope.showTestCases = function(){
	// 	return $scope.challenge.session.exampleFixture && $scope.challenge.session.exampleFixture.length !== 0;
	// };

});