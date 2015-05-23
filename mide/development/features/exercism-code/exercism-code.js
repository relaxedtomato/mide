app.config(function($stateProvider){
	$stateProvider.state('exercism.code', {
		url : '/exercism/code',
		views : {
			'tab-code' : {
				templateUrl : 'features/exercism-code/exercism-code.html',
				controller: 'ExercismCodeCtrl'
			}
		}
	});
});

app.controller('ExercismCodeCtrl', function($scope, ExercismFactory, $state, GistFactory,$ionicPopup,$ionicPopover,FriendsFactory){
	$scope.name = ExercismFactory.getName();
	$scope.code = ExercismFactory.getCodeScript();

	//passing this update function so that on text change in the directive the factory will be alerted
	$scope.compile = function(code){
		ExercismFactory.setCodeScript(code);
		$state.go('exercism.compile');
	};

	//TODO: Cleanup GistFactory.shareGist(code,$scope.data.friends).then(gistShared);

	FriendsFactory.getFriends().then(addFriends);
	$scope.data = [];
	$scope.isChecked = [];
	function addFriends(response){
		console.log('addFriends',response.data.friends);
		$scope.data.friends = response.data.friends;
	};

	//$scope.$watch('isChecked',function(){
	//	console.log($scope.isChecked);
	//});
	$scope.send = function(){
		//console.log($scope.isChecked);
		GistFactory.shareGist(ExercismFactory.getCodeScript(),Object.keys($scope.isChecked)).then(gistShared);
	};

	//$scope.share = function(code){
	// .fromTemplate() method
	//var template = '';
	//$scope.popover = $ionicPopover.fromTemplate(template, {
	//	scope: $scope
	//});

	// .fromTemplateUrl() method
	$ionicPopover.fromTemplateUrl('features/exercism-code/friends.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});
	// Execute action on hide popover
	$scope.$on('popover.hidden', function() {
		// Execute action
	});
	// Execute action on remove popover
	$scope.$on('popover.removed', function() {
		// Execute action
	});
	//};

	gistShared = function(response){
		console.log('gist shared',response);
		$scope.closePopover();
	};
});

//$scope.showPopup = function() {
//	$scope.data = {}
//
//	// An elaborate, custom popup
//	var myPopup = $ionicPopup.show({
//		template: '<input type="password" ng-model="data.wifi">',
//		title: 'Enter Wi-Fi Password',
//		subTitle: 'Please use normal things',
//		scope: $scope,
//		buttons: [
//			{ text: 'Cancel' },
//			{
//				text: '<b>Save</b>',
//				type: 'button-positive',
//				onTap: function(e) {
//					if (!$scope.data.wifi) {
//						//don't allow the user to close unless he enters wifi password
//						e.preventDefault();
//					} else {
//						return $scope.data.wifi;
//					}
//				}
//			}
//		]
//	});
//	myPopup.then(function(res) {
//		console.log('Tapped!', res);
//	});
//	$timeout(function() {
//		myPopup.close(); //close the popup after 3 seconds for some reason
//	}, 3000);
//};
//
////GistFactory.shareGist(code).then(gistShared);
//$scope.data = {};
//$scope.data.friends = [];
//var sharePopUp = $ionicPopup.show({
//	template: 'Friends Names',
//	subTitle: 'Share with Friends',
//	scope: $scope,
//	buttons:
//		[
//			{
//				text: 'Cancel'
//			},
//			{
//				text: '<b>Save</b>',
//				type: 'button-positive',
//				onTap: function(e){
//					if($scope.data.friends.length===0){
//						e.preventDefault();
//					} else {
//
//					}
//				}
//			}
//		]
//})